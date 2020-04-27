const Blog = require('../models/blog')
const User = require('../models/user')

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

const initialUser = {
    username: 'initialUsername',
    name: 'initialName',
    password: 'initialPassword'
}

const newUser = {
    username: 'newUsername',
    name: 'newName',
    password: 'newPassword'
}

const blogsInDB = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDB = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    initialBlogs, blogsInDB, newBlog, initialUser, newUser, usersInDB
}