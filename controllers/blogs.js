const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response, next) => {
    const body = request.body
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes === undefined ? 0 : body.likes
    })

    try {
        const savedblog = await blog.save()
        response.json(savedblog.toJSON())
    } catch (exeption) {
        //console.log(exeption)
        next(exeption)
    }
})

blogsRouter.delete('/:id', async (request, response, next) => {
    try {
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } catch (exeption) {
        next(exeption)
    }
})

blogsRouter.put('/:id', async (request, response, next) => {
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    try {
        const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog)
        response.json(updatedBlog.toJSON())
    } catch (exeption) {
        next(exeption)
    }
})

module.exports = blogsRouter