const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
app.use(cors({
    origin: '*', // During development. Change this to your frontend URL in production
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(express.json());

app.get('/get-wc', (req, res) => {
    const { address } = req.query;
    
    if (!address || !address.startsWith("0x") || address.length !== 42) {
        return res.status(400).json({ error: "Invalid Ethereum address" });
    }

    // Using Uniswap's WalletConnect URL format
    const wcUrl = "wc:3c1fc06c-581c-4f0c-9c96-079f3c0e0000@2?relay-protocol=irn&symKey=0f1f7e3f5b3f1b2ffe4a8aada3702f6b";
    
    res.json({ wcUrl });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});