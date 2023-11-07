import express from 'express'
import { verifyAccessToken } from '../utils/jwt.js'
import { validateOrder } from "../validators/order.js"
import prisma from "../utils/prisma.js"
import Stripe from "stripe"

const router = express.Router()

const stripe = new Stripe('sk_test_51MnGVmDEnY1U6RXxz4NO8VqYta8cJ0KHZE4j6E8EGf8mrp5a8QM4Y8R3zMOBrJRJYZYKgWI73BW7ROghcAt2hdvL00DQxUZmD4');

router.post('/create-checkout-session', async (req, res) => {
  const amount = parseFloat(req.body.sum)
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'myr',
          product_data: {
            name: 'Total',
          },
          unit_amount: parseInt(amount*100),
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `http://localhost:5173/success?id=${req.body.id}`,
    cancel_url: `http://localhost:5173/cancel?id=${req.body.id}`,
  });

  res.json({url: session.url})
});

router.post('/', async (req,res) => {
    const data = req.body
    let orderItem = []
    for (var i of data.cart){
        orderItem.push({productId: i.data.id, quantity: i.quantity})
    }
    const validationErrors = validateOrder(data)
    const token = req.headers.authorization
    
    const user = await verifyAccessToken(token)
    console.log(orderItem)
    if (Object.keys(validationErrors).length != 0) return res.status(400).send({
        error: validationErrors
      })

    prisma.user.update({
        where: {
            id: user.payload.id
        }, 
        data: {
            order_detail: {
                create: {
                    receiver: data.receiver,
                    contact_number: data.contact_number,
                    shipping_address: data.address,
                    payment: {
                        create: {
                            amount: parseInt(parseFloat(data.amount)*100),
                            // status: 'pending'
                        },
                    },
                    order_item: {
                        create: orderItem
                    }
                }
            }
        },
        include: {
            order_detail : {
                orderBy: {
                    createdAt: 'desc',
                },
                take: 1,
                include: {
                    payment: true,
                    order_item: true
                }
            }
        }
    })
    .then(resp => {
        return res.json({message: 'Successfully created order', resp})
    }).catch(err => {
        throw err  // if this happens, our backend application will crash and not respond to the client. because we don't recognize this error yet, we don't know how to handle it in a friendly manner. we intentionally throw an error so that the error monitoring service we'll use in production will notice this error and notify us and we can then add error handling to take care of previously unforeseen errors.
    })
}) 

router.post('/complete', async (req,res) => {
    const id = parseInt(req.body.id)
    const success = req.body.success
    prisma.order_detail.update({
        where: {
            id: id
        },
        data: {
            status : success ? 'success' : 'cancelled' ,
            payment: {
                update: {
                    where: {
                        id: id
                    },
                    data : {
                        status: success ? 'success' : 'cancelled'
                    }
                }
            }
        }
    })
    .then(resp => {
        return res.json(resp)
    }).catch(err => {
        throw err  // if this happens, our backend application will crash and not respond to the client. because we don't recognize this error yet, we don't know how to handle it in a friendly manner. we intentionally throw an error so that the error monitoring service we'll use in production will notice this error and notify us and we can then add error handling to take care of previously unforeseen errors.
    })

})
    

export default router