require('dotenv').config()
const express = require('express');
const app = express();

const AWS = require('aws-sdk');
const sns = new AWS.SNS({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION
});

const port = process.env.PORT;

app.use(express.json());

app.get('/status', (req, res) => res.json({ status: "ok", sns: sns }));

app.post('/subscribe', async (req, res) => {
	try {
		const params = {
			Protocol: 'https',
			TopicArn: process.env.AWS_TOPIC_ARN,
			Endpoint: req.body.url,
			ReturnSubscriptionArn: true
		};
		const response = await sns.subscribe(params).promise();

		/* Call setSubscriptionAttributes to enable raw messsage delivery so subscriber will received only message data*/
		const { SubscriptionArn } = response;
		const enableRawMessageParams = {
			AttributeName: 'RawMessageDelivery',
			SubscriptionArn: SubscriptionArn,
			AttributeValue: 'true'
		};
		await sns.setSubscriptionAttributes(enableRawMessageParams).promise();

		res.status(200).json(response);
	} catch (err) {
		console.log(err);
		res.status(400).json(err);
	}
});

app.post('/publish', async (req, res) => {
	try {
		const message = JSON.parse(req.body.message);
		const params = {
			Message: JSON.stringify(message),
			TopicArn: process.env.AWS_TOPIC_ARN,
		}
		const response = await sns.publish(params).promise();
		res.status(200).json(response);
	} catch (err) {
		res.status(400).json(err);
	}
});

app.listen(port, () => console.log(`SNS App listening on port ${port}!`));