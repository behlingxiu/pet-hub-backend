import express from 'express'
import bcrypt from "bcryptjs"
import prisma from "../utils/prisma.js"
import { validateLogin } from "../validators/auth.js"
import { signAccessToken, verifyAccessToken } from '../utils/jwt.js'
const router = express.Router()

router.post('/', async (req,res) => {
    const data = req.body
  
    const validationErrors = validateLogin(data)
  
    if (Object.keys(validationErrors).length != 0) return res.status(400).send({
      error: validationErrors
    })
  
    const user = await prisma.user.findUnique({
      where: {
        email: data.email
      }
    })
    console.log(user)
    if (!user) return res.status(401).send({
      error: 'Email address or password not valid'
    })
  
    const checkPassword = bcrypt.compareSync(data.password, user.password)
    if (!checkPassword) return res.status(401).send({
      error: 'Email address or password not valid'
    })
  
    const accessToken = await signAccessToken(user)
    return res.json({ user, accessToken })
  }
  )
  
  router.post('/refresh-token', async (req,res) => {
    const token = req.header('authorization');
    
    const userDetails = await verifyAccessToken(token)
    const accessToken = await signAccessToken(userDetails.payload)
    return res.json({ user: userDetails.payload , accessToken})
  })

  export default router