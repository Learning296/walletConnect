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

// Predefined WalletConnect URL (replace with your actual URL in production)
const WC_URL = "wc:e597203d8a2606ea1d4becb697b9108834b4d215309060894b31e25f95f569b0@2?relay-protocol=irn&symKey=b4afd88f2f713a5fc4b66fb2239626d2b3c160dc5f56af70702974548579305f&expiryTimestamp=1746277106";

app.use(express.json());

app.get('/get-wc', (req, res) => {
    const { address } = req.query;
    console.log("Request received for address:", address); // Debug log
    if (!address || !address.startsWith("0x") || address.length !== 42) {
        return res.status(400).json({ error: "Invalid Ethereum address" });
    }
    res.json({ wcUrl: WC_URL });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});