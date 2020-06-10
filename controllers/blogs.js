const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (req, res, next) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    res.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (req, res, next) => {
    const body = req.body
    const decodedToken = jwt.verify(req.token, process.env.SECRET)

    if (!req.token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid'})
    }
    const user = await User.findById(decodedToken.id)

    if(!body.title || !body.url)
        return res.status(400).send()

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    res.status(200).json(blog.toJSON())
})

blogsRouter.delete('/:id', async (request, response, next) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid'})
    }
    const user = await User.findById(decodedToken.id)
    let foundBlog = await Blog.findById(request.params.id)   
    foundBlog = foundBlog.toJSON()
    if (!foundBlog || !foundBlog.user || foundBlog.user.toString() !== user._id.toString())
        return response.status(401).json({ error: 'blog does not belong to logged in user' })

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

blogsRouter.put('/like/:id', async (request, response, next) => {
    const blogToUpdate = await Blog.findById(request.params.id)
    const newLikes = { likes: blogToUpdate.likes += 1 }
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newLikes, { new: true })
    response.status(200).json(updatedBlog.toJSON())
})

module.exports = blogsRouter