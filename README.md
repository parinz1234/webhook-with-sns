# webhook-with-sns
try to use SNS service in AWS to send webhook by following this [article](https://stackabuse.com/publishing-and-subscribing-to-aws-sns-messages-with-node-js/)

## Note

- One Topic can have multiple subscribers
- For calling publish function need to specific `TopicArn` or `TargetArn`
  - specific `TopicArn` if you want to broadcast event to every subscribers
  - specific `TargetArn` ?????
