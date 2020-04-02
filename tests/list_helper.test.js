const totalLikes = require('../utils/list_helper').totalLikes

describe('total likes', () => {
    test('is the sum of all blogs likes in a list', () => {
        const blogs = [{likes: 0}, {likes: 3}, {likes: 1}]

        const result = totalLikes(blogs)
        expect(result).toBe(4)
    })
    test('is the sum of one blogs likes when only one blog in as list', () => {
        const blogs = [{likes: 5}]

        const result = totalLikes(blogs)
        expect(result).toBe(5)
    })
    test('is zero when an empty list', () => {
        const blogs = []

        const result = totalLikes(blogs)
        expect(result).toBe(0)
    })
})