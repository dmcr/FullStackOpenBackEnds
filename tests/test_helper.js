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

const newBlog = {
    title: 'blog numero 4',
    author: 'tester4',
    url: 'http://google.com/4',
    likes: 0
}

const blogsInDB = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs, blogsInDB, newBlog
}