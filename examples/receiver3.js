const amqplib = require('amqplib');

const args = process.argv.slice(2);

const exchangeName = "direct_tweets";

const recieveMsg = async () => {
  const connection = await amqplib.connect('amqp://admin:admin@0.0.0.0:5675');
  const channel = await connection.createChannel();
  await channel.assertExchange('direct_tweets', 'direct', { durable: false });

  const q = await channel.assertQueue('', { exclusive: true });

  args.forEach(function (severity) {
    channel.bindQueue(q.queue, exchangeName, severity);
  });

  channel.consume(q.queue, msg => {
    if (msg.content) console.log(`Routing Key: ${msg.fields.routingKey}, Message: ${msg.content.toString()}`);
  }, { noAck: true })
}

recieveMsg();
