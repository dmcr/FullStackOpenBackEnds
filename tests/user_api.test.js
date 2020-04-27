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
    test('a new user can be added', async () => {
        await api
            .post('/api/users')
            .send(helper.newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

    })
})

afterAll(() => {
    mongoose.connection.close()
})