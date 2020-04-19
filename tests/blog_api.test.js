const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('there are 3 blogs', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(3)
})

test('the first blog is google', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].url).toBe('http://google.com')
})

afterAll(() => {
    mongoose.connection.close()
})