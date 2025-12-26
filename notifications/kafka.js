const { Kafka } = require('kafkajs');
const dotenv = require("dotenv");

dotenv.config();

const kafka = new Kafka({
    clientId: 'user-service',
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'user-group' });

// Connect producer only once
(async () => {
    await producer.connect();
    console.log("PRODUCER CONNECTED ONCE");
})();

const produceMessage = async (topic, message) => {
    try {
        await producer.send({
            topic: topic,
            messages: [{ value: JSON.stringify(message) }]
        });
        console.log("MESSAGE PRODUCED:", topic);
    } catch (err) {
        console.error("PRODUCER ERROR:", err);
    }
};

// Kafka Consumer
const consumeMessages = async (topic, handleMessage) => {
    try {
        await consumer.connect();
        console.log("CONSUMER CONNECTED");

        await consumer.subscribe({ topic, fromBeginning: false });

        await consumer.run({
            eachMessage: async ({ message }) => {
                try {
                    const data = JSON.parse(message.value.toString());
                    await handleMessage(data);
                } catch (err) {
                    console.error("ERROR PROCESSING MESSAGE:", err);
                }
            }
        });
    } catch (err) {
        console.error("CONSUMER ERROR:", err);
    }
};

module.exports = { produceMessage, consumeMessages, kafka };
