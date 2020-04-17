const countBy = require('lodash.countby')
const logger = require('../utils/logger')
const fromPairs = require('lodash.frompairs')

const totalLikes = (blogs) => {
    return blogs.reduce((accumulator, currentValue) => accumulator + currentValue.likes, 0)
}

const mostBlogs = (blogs) => {
    //Reducer method which achieved the same as below lodash countby method
    // const result = blogs.reduce((allAuthors, current) => {
    //     if (current.author in allAuthors)
    //         allAuthors[current.author]++
    //     else
    //         allAuthors[current.author] = 1
    // return allAuthors
    // }, {})

    const results = countBy(blogs, 'author')
    const result = Object.entries(results).pop()
    return fromPairs([[...result]])
}

module.exports = {
    totalLikes,
    mostBlogs
}