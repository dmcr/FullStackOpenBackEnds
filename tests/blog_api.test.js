const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const logger = require('../utils/logger')

const api = supertest(app)

const Blog = require('../models/blog')
const helper = require('../tests/test_helper')

beforeEach(async () => {
    await Blog.deleteMany({})

    for (let blog of helper.initialBlogs) {
        let blogObject = new Blog(blog)
        await blogObject.save()
    }
})

// Tests get all blogs api endpoint
test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

// Tests get all blogs api endpoint
test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

// Tests get all blogs api endpoint
test('the first blog is google', async () => {
    const response = await api.get('/api/blogs')

    const contents = response.body.map(r => r.url)

    expect(contents[0]).toBe('http://google.com')
})

// Tests post new blog endpoint
test('a valid blog can be added', async () => {
    await api
        .post('/api/blogs')
        .send(helper.newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    // Does not test get all blogs endpoint but users helper
    const blogsInDB = await helper.blogsInDB()
    
    const result = blogsInDB.map(({ id, ...blog }) => blog)

    expect(result).toEqual(expect.arrayContaining([helper.newBlog]))
})

afterAll(() => {
    mongoose.connection.close()
})