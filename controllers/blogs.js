const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res, next) => {
    const blogs = await Blog.find({})
    res.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (req, res, next) => {
    const body = req.body

    if(!body.title || !body.url)
        return res.status(400).send()
    
    const blog = new Blog({
        'title': body.title,
        'author': body.author,
        'url': body.url,
        'likes': body.likes || 0
    })

    const savedBlog = await blog.save()
    res.status(200).json(blog.toJSON())
})

blogsRouter.delete('/:id', async (request, response, next) => {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response, next) => {
    const body = request.body
    let updatedFields = {}
    if (body.likes)
        updatedFields.likes = body.likes
    
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, updatedFields, { new: true })
    response.status(200).json(updatedBlog.toJSON())
})

module.exports = blogsRouter