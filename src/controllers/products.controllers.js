import express from 'express'
import { verifyAccessToken } from '../utils/jwt.js'
import prisma from "../utils/prisma.js"
import { validateProduct } from "../validators/product.js"

const router = express.Router()

router.post('/', async (req,res) => {
    const data = req.body
    console.log(data)
    const validationErrors = validateProduct(data)
    const token = req.headers.authorization
    const user = await verifyAccessToken(token)
    console.log(validationErrors)
    if (Object.keys(validationErrors).length != 0) return res.status(400).send({
        error: validationErrors
      })

    prisma.user.update({
        where: {
            id: user.payload.id
        }, 
        data: {
            products: {
                create: {
                    title: data.title,
                    category: data.category,
                    condition: data.condition,
                    price: parseFloat(data.price),
                    stock: parseInt(data.stock),
                    description: data.description,
                    images: {
                        create: data.url
                    }
                }
            }
        }
    })
    .then(resp => {
        return res.json({message: 'Successfully created product'})
    }).catch(err => {
        throw err  // if this happens, our backend application will crash and not respond to the client. because we don't recognize this error yet, we don't know how to handle it in a friendly manner. we intentionally throw an error so that the error monitoring service we'll use in production will notice this error and notify us and we can then add error handling to take care of previously unforeseen errors.
    })
})

router.get('/', async (req,res) => {
    const data = await prisma.product.findMany()
    res.json(data)
})

export default router