import express from 'express';
import paypal from '@paypal/checkout-server-sdk';

const router = express.Router();

// PayPal client configuration
const client = new paypal.core.PayPalHttpClient(
    new paypal.core.SandboxEnvironment('YOUR_CLIENT_ID', 'YOUR_CLIENT_SECRET')
);

// Route to capture an order
router.post('/capture-order', async (req, res) => {
    const { orderID } = req.body;

    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    try {
        const capture = await client.execute(request);
        res.json(capture.result); // Send the capture result as a JSON response
    } catch (err) {
        console.error(err);
        res.status(500).send("Error capturing order");
    }
});

export default router;