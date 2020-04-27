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

describe('GET /api/blogs', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('the first blog is google', async () => {
        const response = await api.get('/api/blogs')
        const contents = response.body.map(r => r.url)
        expect(contents[0]).toBe('http://google.com')
    })

    test('blogs have id', async () => {
        const blogsInDB = await helper.blogsInDB()
        expect(blogsInDB[0].id).toBeDefined()
    })
})


describe('POST /api/blogs', () => {
    test('a valid blog can be added', async () => {
        await api
            .post('/api/blogs')
            .send(helper.newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    
        // Does not test get all blogs endpoint but uses helper
        const blogsInDB = await helper.blogsInDB()
        const result = blogsInDB.map(({ id, ...blog }) => blog)
        expect(result).toEqual(expect.arrayContaining([helper.newBlog]))
    })

    test('an invalid blog cannot be added', async () => {
        const newBlog = helper.newBlog
        delete newBlog.title
        delete newBlog.url

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogs = await helper.blogsInDB()
        expect(blogs).toHaveLength(helper.initialBlogs.length)
    })

    test('likes property defaults to 0', async () => {
        const newBlog = helper.newBlog
        delete newBlog.likes
    
        await api
            .post('/api/blogs')
            .send(newBlog)
    
        const returnedBlogs = await helper.blogsInDB()
        expect(returnedBlogs[2].likes).toBe(0)
    
    })
})

describe('DELETE /api/blogs', () => {
    test('remove an existing blog with valid id', async () => {
        const existingBlogs = await helper.blogsInDB()
    
        await api
            .delete(`/api/blogs/${existingBlogs[0].id}`)
            .expect(204)

        const resultingBlogs = await helper.blogsInDB()
        expect(resultingBlogs).toHaveLength(existingBlogs.length - 1)
    })
})

describe('PUT /api/blogs', () => {
    test('existing blogs likes can be updated', async () => {
        const existingBlogs = await helper.blogsInDB()
        const newLikes = { likes: 100 }

        const updateResponse = await api
            .put(`/api/blogs/${existingBlogs[0].id}`)
            .send(newLikes)
            .expect(200)
            .expect('Content-Type', /application\/json/)
            
        const updatedBlog = updateResponse.body
        expect(updatedBlog.likes).toBe(100)
    })
})

afterAll(() => {
    mongoose.connection.close()
})