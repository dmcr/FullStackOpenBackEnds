const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: 'blog numero uno',
        author: 'tester',
        url: 'http://google.com',
        likes: 0
    },
    {
        title: 'blog numero dos',
        author: 'tester1',
        url: 'http://google.com/1',
        likes: 0
    },
    {
        title: 'blog numero tres',
        author: 'tester2',
        url: 'http://google.com/2',
        likes: 0
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})

    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()

    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()

    blogObject = new Blog(initialBlogs[2])
    await blogObject.save()

})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('there are 3 blogs', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
})

test('a valid blog can be added', async () => {
    const newBlog = {
        title: 'blog numero 4',
        author: 'tester4',
        url: 'http://google.com/4',
        likes: 0
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    
    const returnedBlogs = response.body.map(({ id, ...blog }) => blog)

    expect(returnedBlogs).toEqual(expect.arrayContaining([newBlog]))
})

test('the first blog is google', async () => {
    const response = await api.get('/api/blogs')

    const contents = response.body.map(r => r.url)

    expect(contents[0]).toBe('http://google.com')
})

afterAll(() => {
    mongoose.connection.close()
})