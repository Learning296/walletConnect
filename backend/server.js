const express = require('express');
const cors = require('cors');
const { SignClient } = require('@walletconnect/sign-client');

const app = express();
const PORT = process.env.PORT || 3000;

// IMPORTANT: You must set WALLETCONNECT_PROJECT_ID in your Railway environment variables
const projectId = "0f1f7e3f5b3f1b2ffe4a8aada3702f6b";

if (!projectId) {
    throw new Error("You must provide a WALLETCONNECT_PROJECT_ID env variable");
}

let signClient; // Declare client variable

async function startServer() {
    try {
        // Correctly initialize the client and wait for it to be ready
        signClient = await SignClient.init({
            projectId: projectId,
            metadata: {
                name: 'My DApp',
                description: 'My DApp for WalletConnect',
                url: 'https://wallet-connect-app-iota.vercel.app/', // Your Vercel URL
                icons: ['https://avatars.githubusercontent.com/u/37784886']
            }
        });
        console.log("WalletConnect SignClient initialized successfully.");

        app.use(cors());

        app.get('/get-wc-url', async (req, res) => {
            if (!signClient) {
                return res.status(503).json({ error: "Server is initializing, please try again." });
            }
            try {
                const { uri, approval } = await signClient.connect({
                    optionalNamespaces: {
                        eip155: {
                            methods: ["eth_sendTransaction", "personal_sign"],
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
                console.error("Error during signClient.connect:", error);
                res.status(500).json({ error: `Could not generate WalletConnect URI: ${error.message}` });
            }
        });

        app.get('/', (req, res) => {
            res.send('Live WalletConnect API Server is running.');
        });

        app.listen(PORT, () => {
            console.log(`Live WalletConnect API server started on port ${PORT}`);
        });

    } catch (e) {
        console.error("Failed to start server:", e);
        process.exit(1);
    }
}

startServer();