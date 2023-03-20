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

router.get('/:id', async (req,res) => {
    const id = req.params.id
   
    const data = await prisma.product.findUnique({
        where: {
            id: parseInt(id)
        },
        include: {
            images: true
        }
    })

    if (data) {
        res.json(data)
    } else {
        res.status(400).send({message: 'No record found!'})
    }
    
})

router.get('/category/:category', async (req,res) => {
    const categories = req.params.category
    console.log(categories)
    if (categories !== 'all'){
        const data = await prisma.product.findMany({
            where: {
                category: categories
            },
            include: {
                images: true
            }})
        return res.json(data)
    }
    const data = await prisma.product.findMany({
        include: {
            images: true
        }})
    return res.json(data)
    
})

router.get('/condition/:condition', async (req,res) => {
    const conditions = req.params.condition
    console.log(conditions)
    if (conditions !== 'all'){
        const data = await prisma.product.findMany({
            where: {
                condition: conditions
            },
            include: {
                images: true
            }})
        return res.json(data)
    }
    const data = await prisma.product.findMany({
        include: {
            images: true
        }})
    return res.json(data)
    
})

export default router