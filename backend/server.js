const express = require('express');
const cors = require('cors');
const crypto = require('crypto'); // Add Node.js crypto module
const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
app.use(cors({
    origin: '*', // During development. Change this to your frontend URL in production
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(express.json());

// WalletConnect v2 configuration
const projectId = "0f1f7e3f5b3f1b2ffe4a8aada3702f6b";
const metadata = {
    name: 'Funding DApp',
    description: 'Funding Contract DApp on Sepolia',
    url: 'https://wallet-connect-app-iota.vercel.app',
    icons: ['https://avatars.githubusercontent.com/u/37784886']
};

const CONTRACT_ADDRESS = "0x7e088527412243A0806369904EeD66DDc4f0a94B";

app.get('/get-wc', async (req, res) => {
    const { address } = req.query;
    
    if (!address || !address.startsWith("0x") || address.length !== 42) {
        return res.status(400).json({ error: "Invalid Ethereum address" });
    }

    try {
        // Create WalletConnect v2 connection URL with proper parameters
        const symKey = generateSymKey();
        const wcUrl = `wc:${projectId}@2?relay-protocol=irn&symKey=${symKey}&chainId=11155111&contractAddress=${CONTRACT_ADDRESS}`;
        res.json({ wcUrl });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: "Failed to generate WalletConnect URL" });
    }
});

// Helper function to generate symmetric key using Node.js crypto
function generateSymKey() {
    return crypto.randomBytes(32).toString('hex');
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});