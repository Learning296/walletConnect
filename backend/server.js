const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// This is the WalletConnect URL from your client's screenshot
const MY_WALLET_CONNECT_URL = "wc:427d48481a039c0d9932e850de0680cb76363e7d0539bbbfb5b808c64c31b35@2?relay-protocol=irn&symKey=2bb7ec84df0df2de79c8d0635bd1977075cdef6eacc5d5fd67bde373faf5d8683&expiryTimestamp=1746102035";

// Use CORS to allow requests from any origin.
// For production, you should lock this down to your Vercel URL:
// app.use(cors({ origin: 'https://your-vercel-app.vercel.app' }));
app.use(cors());

// The API endpoint that your Vercel frontend calls
app.get('/get-wc-url', (req, res) => {
    const { address } = req.query;

    // We just check that an address was sent, as per the design
    if (!address || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
        return res.status(400).json({ error: "A valid Ethereum address parameter is required." });
    }

    // Always return the same WalletConnect URL
    console.log(`Valid request for ${address}. Responding with WC URL.`);
    res.json({ wcUrl: MY_WALLET_CONNECT_URL });
});

// A simple root endpoint to confirm the server is running
app.get('/', (req, res) => {
    res.send('WalletConnect API Server is running.');
});

app.listen(PORT, () => {
    console.log(`API server started on port ${PORT}`);
});