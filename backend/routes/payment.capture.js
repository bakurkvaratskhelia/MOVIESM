router.post('/capture-order', async (req, res) => {
    const { orderID } = req.body;

    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    try {
        const capture = await client.execute(request);
        res.json(capture.result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error capturing order");
    }
});