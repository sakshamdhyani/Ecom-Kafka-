const {Kafka} = require('kafkajs');

// Kafka configuration
const kafka = new Kafka({
    clientId: 'user-service',
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
})

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'user-group' });

// Function to produce messages
const produceMessage = async (topic, message) => {
    console.log("CONNNECTING PRODUCER");
    await producer.connect();
    console.log("PRODUCER CONNECTED");
    await producer.send({
        topic: topic,
        messages: [
            { value: JSON.stringify(message) }
        ],
    });
    console.log("MESSAGE PRODUCED");
    await producer.disconnect();
    console.log("PRODUCER DISCONNECTED");
};


// Function to consume messages
const consumeMessages = async (topic, handleMessage) => {
    console.log("CONNECTING CONSUMER");
    await consumer.connect();
    console.log("CONSUMER CONNECTED");
    await consumer.subscribe({ topic: topic, fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const parsedMessage = JSON.parse(message.value.toString());
            handleMessage(parsedMessage);
        },
    });
    console.log("CONSUMER RUNNING");
};


module.exports = {
    produceMessage,
    consumeMessages,
    kafka
};