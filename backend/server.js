import express from 'express';
import cookieParser from 'cookie-parser';
import path from "path";

import authRoutes from "./routes/auth.route.js";
import movieRoutes from "./routes/movie.route.js";
import tvRoutes from "./routes/tv.route.js";
import searchRoutes from "./routes/search.route.js";
import payRoutes from './routes/pay.route.js';
import dotenv from 'dotenv';


import { ENV_VARS } from './config/envVars.js';
import { connectDB } from './config/db.js';
import { protectRoute } from './middleware/protectRoute.js';

dotenv.config();

const app = express();
const PORT = ENV_VARS.PORT || 5000;
const __dirname = path.resolve();

const paypal = {
    createOrder: async () => {
        // Simulate creating an order and return a URL
        return 'https://www.paypal.com/checkoutnow?token=exampleToken';
    }
};



app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/pay", payRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/movie", protectRoute, movieRoutes);
app.use("/api/v1/tv", protectRoute, tvRoutes);
app.use("/api/v1/search", protectRoute, searchRoutes);


app.post('/pay', async (req, res) => {
    try {
        const url = await paypal.createOrder();
        res.redirect(url);
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
});



if (ENV_VARS.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    


    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });

    
    
}

app.listen(PORT, () => {
    console.log('Server started at http://localhost:' + PORT);
    connectDB();
});