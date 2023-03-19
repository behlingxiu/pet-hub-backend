import express from 'express'
import bcrypt from "bcryptjs"
import { Prisma } from "@prisma/client"
import prisma from "../utils/prisma.js"
import { validateUser } from "../validators/users.js"
import { signAccessToken, verifyAccessToken } from '../utils/jwt.js'
import { filter } from "../utils/common.js"
// import sgMail from '@sendgrid/mail'
const router = express.Router()

router.post('/', async (req, res) => {
    const data = req.body
    const validationErrors = validateUser(data)
  
    if (Object.keys(validationErrors).length != 0) return res.status(400).send({
      error: validationErrors
    })
    data.password = bcrypt.hashSync(data.password, 8);
    prisma.user.create({
      data
    }).then(async (user) => {
        // const msg = {
        //     to: data.email, // Change to your recipient
        //     from: 'jinyee0117@gmail.com', // Change to your verified sender
        //     subject: 'Sending with SendGrid is Fun',
        //     text: 'and easy to do anywhere, even with Node.js',
        //     html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        // }
        
        // sgMail
        // .send(msg)
        // .then((response) => {
        //     console.log(response[0].statusCode)
        //     console.log(response[0].headers)
        // })
        // .catch((error) => {
        //     console.error(error)
        // })
        const accessToken = await signAccessToken(user)
        return res.json({ user, accessToken })
  
    }).catch(err => {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        const formattedError = {}
        formattedError[`${err.meta.target[0]}`] = 'already taken'
  
        return res.status(500).send({
          error: formattedError
        });  // friendly error handling
      }
      throw err  // if this happens, our backend application will crash and not respond to the client. because we don't recognize this error yet, we don't know how to handle it in a friendly manner. we intentionally throw an error so that the error monitoring service we'll use in production will notice this error and notify us and we can then add error handling to take care of previously unforeseen errors.
    })
    
  })

  //get user data for user profile
  router.get('/', async(req, res) => {
    const token = req.headers.authorization
    const user = await verifyAccessToken(token)

    const data = await prisma.user.findUnique({
      where: {
        id: user.payload.id
      },
      include: {
        products: {
          include: {
            images: true
          }
        }
      }
    })

    if (data) {
      res.json(data)
    } else {
      res.status(400).send({message: 'No record found!'})
    }
  })
  

  export default router