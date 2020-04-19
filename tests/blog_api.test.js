const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const helper = require('../tests/test_helper')

beforeEach(async () => {
    await Blog.deleteMany({})

    let blogObject = new Blog(helper.initialBlogs[0])
    await blogObject.save()

    blogObject = new Blog(helper.initialBlogs[1])
    await blogObject.save()

    blogObject = new Blog(helper.initialBlogs[2])
    await blogObject.save()

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

// Tests post new blog endpoint
test('a valid blog can be added', async () => {
    await api
        .post('/api/blogs')
        .send(helper.newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const blogsInDB = await helper.blogsInDB()
    
    const result = blogsInDB.map(({ id, ...blog }) => blog)

    expect(result).toEqual(expect.arrayContaining([helper.newBlog]))
})

test('the first blog is google', async () => {
    const response = await api.get('/api/blogs')

    const contents = response.body.map(r => r.url)

    expect(contents[0]).toBe('http://google.com')
})

afterAll(() => {
    mongoose.connection.close()
})