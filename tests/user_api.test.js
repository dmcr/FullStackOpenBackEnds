const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const logger = require('../utils/logger')
const api = supertest(app)
const User = require('../models/user')
const helper = require('../tests/test_helper')
const mongoose = require('mongoose')

beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash(helper.initialUser.password, 10)
    const user = new User({ 
        username: helper.initialUser.username, 
        name: helper.initialUser.name, 
        passwordHash 
    })

    await user.save()
})

describe('POST /api/users', () => {
    test('a valid user can be added', async () => {
        await api
            .post('/api/users')
            .send(helper.newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        let users = await helper.usersInDB()
        users = users.map(({id, blogs, ...user}) => user)
        expect(users).toEqual(expect.arrayContaining([{ username: helper.newUser.username, name: helper.newUser.name }]))
    })
    test('a user cannot be added if username exists', async () => {
        const result = await api
            .post('/api/users')
            .send(helper.initialUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
    })
})
describe('GET /api/users', () => {
    test('get all users', async () => {
        const result = await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const users = result.body.map(({id, blogs, ...user}) => user)
        expect(users).toHaveLength(1)
        const expectedUser = helper.initialUser
        delete expectedUser.password
        expect(users).toEqual(expect.arrayContaining([{ ...expectedUser }]))
    })
})

afterAll(() => {
    mongoose.connection.close()
})