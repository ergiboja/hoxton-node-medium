import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient({ log: ['warn', 'error', 'info', 'query'] })
const app = express()
app.use(cors())
app.use(express.json())

const port = 4000
app.get('/user', async (req, res) => {
    const user = await prisma.user.findMany({
      include: { posts: true },
     
    })
    res.send(user)
  })
  app.get('/user/:id', async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.id) },
      include: { posts:true}
    })
  
    if (user) {
      res.send(user)
    } else {
      res.status(404).send({ error: '404 Data Not found' })
    }
  })


  app.get('/post', async (req, res) => {
    const post = await prisma.post.findMany({
      include: { users:true, comment: true }
     
    })
    res.send(post)
  })
  app.post('/post', async (req, res) => {

        const post = await prisma.post.create({
            data: req.body,
            include: {users:true}
    })
    res.send(post)
  })


 
 


  app.get('/post/:id', async (req, res) => {
    const post = await prisma.post.findUnique({
      where: { id: Number(req.params.id) },
      include: { comment:true}
    })
  
    if (post) {
      res.send(post)
    } else {
      res.status(404).send({ error: '404 Data Not found' })
    }
  })
  app.patch('/post/:id', async (req, res) => {
    const id = Number(req.params.id)
    const post = await prisma.post.update({
      where: { id },
      data: req.body,
    })
    res.send(post)
  })
  app.get('/comments', async (req, res) => {
    const comments = await prisma.comments.findMany()
    res.send(comments)
  })
  app.post('/comments', async (req, res) => {

    const comment = await prisma.comments.create({
        data: req.body,
        
})
res.send(comment)
})


app.listen(port, () => {
    console.log(`Listening: http://localhost:${port}`)
  })