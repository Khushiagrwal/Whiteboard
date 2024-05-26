import express from "express";
import mongoose from "mongoose";
import userRoute from "./Routes/user.route.js";
import userAuth from "./Routes/auth.route.js";
import cors from "cors";
import { createServer } from "http";
import { Server } from 'socket.io';
import blogRoute from "./Routes/blog.route.js"
import Stripe from "stripe";


// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/whiteboard_')
    .then(() => {
        console.log("Database successfully connected");
    })
    .catch((err) => {
        console.error("Database connection error:", err);
    }
);

const stripe = Stripe("sk_test_51P9W2LSBfqHF6tBnzH6XrDwa8kkXJnGicVMARVxfcGXvgv2MePMa36JpVfEkryvmGloIOPyoalLxKxmEZJucd58S00RjebhdE9");
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
     methods: ["GET", "POST"]
}));

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected successfully', socket.id);
    
    socket.on('drawing', (data) => {
        socket.broadcast.emit('drawing', data);
    });

    socket.on('disconnect', () => {
        console.log('User Disconnected');
    });
});


// Routes
app.use('/api/user', userRoute);
app.use('/api/auth', userAuth);
app.use('/api/blog',blogRoute);

app.post("/api/create-checkout-session", async (req, res) => {
    const { amount } = req.body;
    console.log(amount); 
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{
            price_data: {
                currency: 'inr',
                product_data: {
                    name: 'Subscription',
                },
                unit_amount: amount * 100, // converting amount to cents
            },
            quantity: 1,
        }],
        mode: "payment",
        success_url: "http://localhost:5173/success",
        cancel_url: "http://localhost:5173/cancel",
    });
    res.json({ id: session.id });
});
 
// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server error';
    return res.status(statusCode).json({
        success: false,
        statusCode: statusCode,
        message: message
    });
});

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// hyy 