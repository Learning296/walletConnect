const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// This is your DApp's specific, pre-generated WalletConnect URL
const MY_WALLET_CONNECT_URL = "wc:427d48481a039c0d9932e850de0680cb76363e7d0539bbbfb5b808c64c31b35@2?relay-protocol=irn&symKey=2bb7ec84df0df2de79c8d0635bd1977075cdef6eacc5d5fd67bde373faf5d8683&expiryTimestamp=1746102035";

// Allow all origins for simplicity. 
// In production, you should restrict this to your Vercel URL.
app.use(cors()); 

app.use(express.json());

// API endpoint that the frontend will call
app.get('/get-wc-url', (req, res) => {
    const { address } = req.query;
    
    // Validate the address received from the frontend
    if (!address || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
        return res.status(400).json({ error: "A valid Ethereum address is required in the query." });
    }

    // If the address is valid, return the predefined WalletConnect URL.
    // The address itself is not used to generate the URL, only to validate the request.
    console.log(`Received valid request for address: ${address}. Sending WC URL.`);
    res.json({ wcUrl: MY_WALLET_CONNECT_URL });
});

app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
});