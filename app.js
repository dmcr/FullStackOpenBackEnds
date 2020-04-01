const config = require('./utils/config')
const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
const Blog = require('./models/blog')

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(success => (success) ? console.log('Connected To MongoDB Blog Cluster') : '')
    .catch(error => console.error('Failed to connect to mongoDB Blog cluster:', error.message))

app.use(cors())
app.use(express.json())

app.get('/api/blogs', (req, res, next) => {
    Blog
        .find({})
        .then(blogs => blogs.map(blog => blog.toJSON()))
        .then(blogsJSON => {
            res.json(blogsJSON)
        })
        .catch(error => next(error))
})

app.post('/api/blogs', (req, res, next) => {
    const body = req.body
    
    const blog = new Blog({
        'title': body.title,
        'author': body.author,
        'url': body.url,
        'likes': body.likes
    })

    blog
        .save()
        .then(result => result.toJSON())
        .then(resultJSON => {
            res.status(201).json(resultJSON)
        })
        .catch(error => next(error))
})

module.exports = app