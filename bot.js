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



// const { Client, LocalAuth } = require('whatsapp-web.js');
// const qrcode = require('qrcode-terminal');
// const nodemailer = require('nodemailer');
// const express = require('express');
// const bodyParser = require('body-parser');
// const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args)); // ES module import workaround for node-fetch
// require('dotenv').config();

// const app = express();
// app.use(bodyParser.json());

// const PORT = process.env.PORT || 3000;

// // Initialize the WhatsApp client with local authentication
// const client = new Client({
//     authStrategy: new LocalAuth()
// });

// // Configure nodemailer for sending QR code via email
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//     }
// });

// // Function to send QR code via email
// const sendQRCodeEmail = (qr) => {
//     const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: 'shivatadigadapa@gmail.com',
//         subject: 'WhatsApp QR Code',
//         html: `<p>Scan this QR code to log in to the WhatsApp bot:</p><br/><img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qr)}" alt="QR Code"/>`
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             console.error('Error sending email:', error);
//         } else {
//             console.log('Email sent successfully:', info.response);
//         }
//     });
// };

// // Generate QR code for WhatsApp authentication
// client.on('qr', (qr) => {
//     qrcode.generate(qr, { small: true });
//     sendQRCodeEmail(qr);
// });

// // Confirm successful authentication and start listening to messages
// client.on('ready', () => {
//     console.log('WhatsApp bot is ready!');
// });

// // Listen for incoming WhatsApp messages
// client.on('message', async (message) => {
//     try {
//          const chat = await message.getChat(); 

//         if (chat.isGroup && chat.name === 'DevAtoms') {
//             console.log(`Received message from group ${chat.name}: ${message.body}`);

//             // Send the message to Slack
//             const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
//             const response = await fetch(slackWebhookUrl, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     text: `Message from WhatsApp Group "${chat.name}" by ${message.author}:\n${message.body}`
//                 })
//             });

//             if (!response.ok) {
//                 const errorText = await response.text();
//                 console.error(`Failed to send message to Slack. Status: ${response.status}. Error: ${errorText}`);
//             } else {
//                 console.log('Message sent to Slack successfully!');
//             }
//         }
//     } catch (error) {
//         console.error('Error processing message:', error);
//     }
// });

// // Route to handle Slack events
// app.post('/slack/events', async (req, res) => {
//     const event = req.body.event;

//     // Check if it's a message event
//     if (event && event.type === 'message' && event.text && !event.bot_id) {
//         try {
//             const chat = await client.getChats();
//             const devAtomsChat = chat.find(c => c.isGroup && c.name === 'DevAtoms');

//             if (devAtomsChat) {
//                 await devAtomsChat.sendMessage(`Message from Slack by ${event.user}:\n${event.text}`);
//                 console.log('Message sent to WhatsApp group DevAtoms.');
//             } else {
//                 console.error('DevAtoms group not found.');
//             }
//         } catch (error) {
//             console.error('Error sending message to WhatsApp:', error);
//         }
//     }

//     res.sendStatus(200); // Acknowledge the event to Slack
// });

// // Start the Express server
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

// client.initialize();


const crypto = require('crypto');
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET;

// Middleware to verify Slack requests
const verifySlackRequest = (req, res, next) => {
    const slackSignature = req.headers['x-slack-signature'];
    const requestBody = JSON.stringify(req.body);
    const timestamp = req.headers['x-slack-request-timestamp'];
    
    // Prevent replay attacks
    const time = Math.floor(Date.now() / 1000);
    if (Math.abs(time - timestamp) > 300) {
        return res.status(400).send('Ignore this request.');
    }

    const sigBasestring = `v0:${timestamp}:${requestBody}`;
    const hmac = crypto.createHmac('sha256', SLACK_SIGNING_SECRET);
    const [version, hash] = slackSignature.split('=');
    
    hmac.update(sigBasestring);
    const myHash = hmac.digest('hex');

    if (crypto.timingSafeEqual(Buffer.from(myHash), Buffer.from(hash))) {
        next();
    } else {
        res.status(400).send('Verification failed');
    }
};

// Route to handle Slack events
app.post('/slack/events', async (req, res) => {
    const { type, challenge, event } = req.body;

    // Respond to Slack's URL verification challenge
    if (type === 'url_verification') {
        return res.json({ challenge });
    }

    // Continue processing other Slack events
    if (event && event.type === 'message' && event.text && !event.bot_id) {
        try {
            const chat = await client.getChats();
            const devAtomsChat = chat.find(c => c.isGroup && c.name === 'DevAtoms');

            if (devAtomsChat) {
                await devAtomsChat.sendMessage(`Message from Slack by ${event.user}:\n${event.text}`);
                console.log('Message sent to WhatsApp group DevAtoms.');
            } else {
                console.error('DevAtoms group not found.');
            }
        } catch (error) {
            console.error('Error sending message to WhatsApp:', error);
        }
    }

    // Acknowledge receipt of the event
    res.sendStatus(200);
});

// Initialize WhatsApp client and other services here...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
