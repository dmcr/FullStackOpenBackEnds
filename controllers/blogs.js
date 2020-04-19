const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res, next) => {
    const blogs = await Blog.find({})
    response.json(blogs.map(blog => blog.toJSON()))

})

blogsRouter.post('/', (req, res, next) => {
    const body = req.body
    
    const blog = new Blog({
        'title': body.title,
        'author': body.author,
        'url': body.url,
        'likes': body.likes
    })

    blog
        .save()
        .then(savedBlog => savedBlog.toJSON())
        .then(savedBlogJSON => res.status(201).json(savedBlogJSON))
        .catch(error => next(error))
})

module.exports = blogsRouter