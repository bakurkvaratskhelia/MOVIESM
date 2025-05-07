import express from 'express';
import client from './paypal.config.js';

const router = express.Router();

router.post('/create-order', async (req, res) => {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
        intent: "CAPTURE",
        purchase_units: [{
            amount: {
                currency_code: "USD",
                value: "10.00"
            }
        }]
    });

    try {
        const order = await client.execute(request);
        res.json({ id: order.result.id });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating order");
    }
});

export default router;