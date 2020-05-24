require('dotenv').config()
const express = require('express');
const app = express();

const AWS = require('aws-sdk');
const sns = new AWS.SNS({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION
});

const port = 3000;

app.use(express.json());

app.get('/status', (req, res) => res.json({ status: "ok", sns: sns }));

app.listen(port, () => console.log(`SNS App listening on port ${port}!`));