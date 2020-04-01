const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (req, res, next) => {
    Blog
        .find({})
        .then(blogs => blogs.map(blog => blog.toJSON()))
        .then(blogsJSON => res.json(blogsJSON))
        .catch(error => next(error))
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