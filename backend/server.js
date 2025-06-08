const express = require('express');
const cors = require('cors');
const { SignClient } = require('@walletconnect/sign-client');

const app = express();
const PORT = process.env.PORT || 3000;

// IMPORTANT: You must set WALLETCONNECT_PROJECT_ID in your Railway environment variables
const projectId = process.env.WALLETCONNECT_PROJECT_ID;

if (!projectId) {
    throw new Error("You must provide a WALLETCONNECT_PROJECT_ID env variable");
}

const signClient = SignClient.init({
    projectId: projectId,
    metadata: {
        name: 'My DApp',
        description: 'My DApp for WalletConnect',
        url: 'https://wallet-connect-app-iota.vercel.app/', // Your Vercel URL
        icons: ['https://avatars.githubusercontent.com/u/37784886']
    }
});

// Use CORS to allow requests from any origin.
// For production, you should lock this down to your Vercel URL:
// app.use(cors({ origin: 'https://your-vercel-app.vercel.app' }));
app.use(cors());

// This endpoint generates a new, live WC link on every call
app.get('/get-wc-url', async (req, res) => {
    try {
        const { uri, approval } = await signClient.connect({
            requiredNamespaces: {
                eip155: {
                    methods: [
                        "eth_sendTransaction",
                        "personal_sign"
                    ],
                    chains: ["eip155:1"], // Ethereum Mainnet
                    events: ["accountsChanged", "chainChanged"]
                }
            }
        });

        if (uri) {
            console.log('Generated new WC URI:', uri);
            res.json({ wcUrl: uri });
        } else {
            res.status(500).json({ error: "Failed to generate WalletConnect URI" });
        }
    } catch (error) {
        console.error("Error generating WalletConnect URI:", error);
        res.status(500).json({ error: `Could not generate WalletConnect URI: ${error.message}` });
    }
});

// A simple root endpoint to confirm the server is running
app.get('/', (req, res) => {
    res.send('Live WalletConnect API Server is running.');
});

app.listen(PORT, () => {
    console.log(`Live WalletConnect API server started on port ${PORT}`);
});