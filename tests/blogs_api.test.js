const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')


beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[2])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[3])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[4])
  await blogObject.save()

})

describe('Initial dB tests', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are six Blogs', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body.length).toBe(helper.initialBlogs.length)
  })


  test('does first item contain id?', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })
})

describe('Adding Blogs tests', () => {
  test('does POST add blog to dB?', async () => {
    const newBlog =
    {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      __v: 0
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect('Content-Type', /application\/json/)


    const blogsAtEnd = await helper.blogInDb()
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)
  })


  test('does id default to 0 if missing', async () => {
    const newBlog =
    {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      __v: 0
    }

    await api
      .post('/api/blogs')
      .send(newBlog)

    const blogsAtEnd = await helper.blogInDb()
    expect(blogsAtEnd[helper.initialBlogs.length].likes).toBe(0)
  })


  test('error 400 if url/title missing', async () => {
    const newBlog =
    {
      _id: "5a422bc61b54a676234d17fc",
      author: "Robert C. Martin",
      likes: 5,
      __v: 0
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogInDb()
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
  })
})

describe('Deleting Blogs', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    await api
      .delete(`/api/blogs/5a422a851b54a676234d17f7`)
      .expect(204)

    const blogsAtEnd = await helper.blogInDb()
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length - 1)

  })

  test('returns 400 if id is invalid', async () => {
    await api
      .delete('/api/blogs/6854216854')
      .expect(400)

    const blogsAtEnd = await helper.blogInDb()
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
  })
})

describe('updating blog', () => {
  test('succeeds with status code 200', async () => {
    const blogsAtStart = await helper.blogInDb()
    const updatingBlog = blogsAtStart[0]

    const newBlog999 = {
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 999
    }


    await api
      .put(`/api/blogs/${updatingBlog.id}`)
      .send(newBlog999)
      .expect(200)

    const blogsAtEnd = await helper.blogInDb()
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)

    expect(blogsAtEnd[0].likes).toBe(newBlog999.likes)

  })

})

afterAll(() => {
  mongoose.connection.close()
})