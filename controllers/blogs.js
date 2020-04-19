const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res, next) => {
    const blogs = await Blog.find({})
    res.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (req, res, next) => {
    const body = req.body
    
    const blog = new Blog({
        'title': body.title,
        'author': body.author,
        'url': body.url,
        'likes': body.likes
    })

    const savedBlog = await blog.save()
    res.status(200).json(blog.toJSON())
})

module.exports = blogsRouter