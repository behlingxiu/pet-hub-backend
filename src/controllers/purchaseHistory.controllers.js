import express from 'express'
import { verifyAccessToken } from '../utils/jwt.js'
import prisma from "../utils/prisma.js"
import { validateProduct } from "../validators/product.js"

const router = express.Router()

//get order details for my order and purchase history
router.get('/', async(req, res) => {
    const token = req.headers.authorization
    const user = await verifyAccessToken(token)

    const data = await prisma.user.findUnique({
      where: {
        id: user.payload.id
      },
      include: {
        order_detail: {
          include: {
            order_item: true,
            payment: true
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