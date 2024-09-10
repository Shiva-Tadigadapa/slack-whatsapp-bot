// const { Client, LocalAuth } = require('whatsapp-web.js');
// const qrcode = require('qrcode-terminal');
// const { setImmediate } = require('timers'); // For non-blocking operations

// // Initialize the WhatsApp client with local authentication
// const client = new Client({
//     authStrategy: new LocalAuth(),
//     puppeteer: {
//         headless: true, // Ensures Puppeteer runs without a UI, improving performance
//         args: ['--no-sandbox', '--disable-setuid-sandbox'] // Optimizations for Puppeteer
//     }
// });

// // Generate QR code for authentication
// client.on('qr', (qr) => {
//     qrcode.generate(qr, { small: true });
// });

// // Confirm successful authentication and start listening to messages
// client.on('ready', () => {
//     console.log('WhatsApp bot is ready!');
// });

// // Listen for incoming messages
// client.on('message', async (message) => {
//     setImmediate(async () => { // Use setImmediate to prevent blocking the event loop
//         try {
//             const chat = await message.getChat(); // Get the chat object for the message

//             if (chat.isGroup && chat.name === 'DevAtoms') { // Check if it's from the desired group
//                 console.log(`Received message from group ${chat.name}: ${message.body}`);
//                 // chat.sendMessage("Message sending to Slack...");

//                 // Dynamically import node-fetch to handle ES module
//                 const fetch = await import('node-fetch');

//                 // Slack Incoming Webhook URL
//                 const slackWebhookUrl = 'https://hooks.slack.com/services/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'; // Replace with your actual Webhook URL

//                 // Send the message to Slack without blocking the main process
//                 fetch.default(slackWebhookUrl, {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify({
//                         text: `Message from WhatsApp Group "${chat.name}" by ${message.author}:\n${message.body}`
//                     })
//                 })
//                 .then(response => {
//                     if (response.ok) {
//                         console.log('Message sent to Slack successfully!');
//                         chat.sendMessage("Message Sent To Slack.");
//                     } else {
//                         response.text().then(errorText => {
//                             console.error(`Failed to send message to Slack. Status: ${response.status}. Error: ${errorText}`);
//                         });
//                     }
//                 })
//                 .catch(error => {
//                     console.error('Error sending message to Slack:', error);
//                 });
//             }
//         } catch (error) {
//             console.error('Error processing message:', error);
//         }
//     });
// });

// client.initialize();



const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
// Initialize the WhatsApp client with local authentication
const client = new Client({
    authStrategy: new LocalAuth()
});

// Generate QR code for authentication
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

// Confirm successful authentication and start listening to messages
client.on('ready', () => {
    console.log('WhatsApp bot is ready!');
});

// Listen for incoming messages
client.on('message', async (message) => {
    try {
        const chat = await message.getChat(); // Get the chat object for the message

        if (chat.isGroup && chat.name === 'DevAtoms') { // Check if it's from the desired group
            console.log(`Received message from group ${chat.name}: ${message.body}`);
            // chat.sendMessage("Message sending to Slack.....");

            // Dynamically import node-fetch to handle ES module
            const fetch = (await import('node-fetch')).default;

            // Slack Incoming Webhook URL
            const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;

            try {
                // Send the message to Slack
                const slackResponse = await fetch(slackWebhookUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        text: `Message from WhatsApp Group "${chat.name}" by ${message.author}:\n${message.body}`
                    })
                });

                if (slackResponse.ok) {
                    console.log('Message sent to Slack successfully!');
                    // chat.sendMessage("Message Sent To Slack.");
                } else {
                    const errorText = await slackResponse.text();
                    console.error(`Failed to send message to Slack. Status: ${slackResponse.status}. Error: ${errorText}`);
                    // chat.sendMessage(`Failed to send message to Slack. Status: ${slackResponse.status}. Error: ${errorText}`);
                }
            } catch (fetchError) {
                console.error('Error making request to Slack:', fetchError);
                chat.sendMessage('Error making request to Slack.');
            }
        }
    } catch (error) {
        console.error('Error processing message:', error);
    }
});

client.initialize();

// Setup Express server to handle Slack events (optional if needed)
const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
