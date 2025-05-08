import { ENV_VARS } from './config/envVars.js';
import { connectDB } from './config/db.js';

import express from 'express';

const app = express();
const PORT = ENV_VARS.PORT;


dotenv.config()
const express = ('express')
const paypal = ('./services/paypal')



app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/pay', async(req, res) => {
    try {
        const url = await paypal.createOrder()

        res.redirect(url)
    } catch (error) {
        res.send('Error: ' + error)
    }
})

app.get('/complete-order', async (req, res) => {
    try {
        await paypal.capturePayment(req.query.token)

        res.send('Course purchased successfully')
    } catch (error) {
        res.send('Error: ' + error)
    }
})

app.get('/cancel-order', (req, res) => {
    res.redirect('/')
})

app.listen(PORT, () => {
    console.log('Server started at http://localhost:' + PORT);
    connectDB();
});