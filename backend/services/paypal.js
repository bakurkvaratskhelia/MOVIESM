import axios from "axios";
import { ENV_VARS } from "../config/envVars.js";

const PAYPAL_BASE_URL = ENV_VARS.PAYPAL_BASE_URL;
const PAYPAL_CLIENT_ID = ENV_VARS.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = ENV_VARS.PAYPAL_SECRET;
const BASE_URL = ENV_VARS.BASE_URL;

// Generate Access Token
async function generateAccessToken() {
    try {
        const response = await axios({
            url: PAYPAL_BASE_URL + '/v1/oauth2/token',
            method: 'post',
            data: 'grant_type=client_credentials',
            auth: {
                username: PAYPAL_CLIENT_ID,
                password: PAYPAL_SECRET,
            },
        });

        return response.data.access_token;
    } catch (error) {
        console.error("Error generating PayPal access token:", error.response?.data || error.message);
        throw new Error("Failed to generate PayPal access token");
    }
}

// Create PayPal Order
export async function createOrder({ items, totalAmount, currency = "USD" }) {
    try {
        const accessToken = await generateAccessToken();

        const response = await axios({
            url: PAYPAL_BASE_URL + '/v2/checkout/orders',
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            data: JSON.stringify({
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        items: items.map(item => ({
                            name: item.name,
                            description: item.description,
                            quantity: item.quantity,
                            unit_amount: {
                                currency_code: currency,
                                value: item.unitAmount,
                            },
                        })),
                        amount: {
                            currency_code: currency,
                            value: totalAmount,
                            breakdown: {
                                item_total: {
                                    currency_code: currency,
                                    value: totalAmount,
                                },
                            },
                        },
                    },
                ],
                application_context: {
                    return_url: `${BASE_URL}/complete-order`,
                    cancel_url: `${BASE_URL}/cancel-order`,
                    shipping_preference: 'NO_SHIPPING',
                    user_action: 'PAY_NOW',
                    brand_name: 'manfra.io',
                },
            }),
        });

        // Return the approval link
        return response.data.links.find(link => link.rel === 'approve').href;
    } catch (error) {
        console.error("Error creating PayPal order:", error.response?.data || error.message);
        throw new Error("Failed to create PayPal order");
    }
}

// Capture PayPal Payment
export async function capturePayment(orderId) {
    try {
        const accessToken = await generateAccessToken();

        const response = await axios({
            url: `${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error capturing PayPal payment:", error.response?.data || error.message);
        throw new Error("Failed to capture PayPal payment");
    }
}
export default {
    generateAccessToken,
    createOrder,
    capturePayment,
};