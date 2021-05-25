const { Kafka, logLevel } = require('kafkajs');
const express = require("express");
const http = require('http');
const {
  KAFKA_HOST,
  KAFKA_TOPIC
} = process.env;

const app = express();

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


app.post('/api/sendMsg', function (req, res, next) {
    
    // const postBody = req.body;
    const msg = "This is a test message";
    
    
    
    const host = `${KAFKA_HOST}`; // process.env.HOST_IP || ip.address()

    const kafka = new Kafka({
        logLevel: logLevel.INFO,
        brokers: [host],
        clientId: 'example-producer'
    });


    const topic = `${KAFKA_TOPIC}`;
    const producer = kafka.producer()

    const getRandomNumber = () => Math.round(Math.random(10) * 1000)
    const createMessage = num => (
        {
            key: `${num}`,
            value: JSON.stringify({
                time: `${new Date().toISOString()}`,
                type: `${num}`
            }),
            partition: 0
        }
    )

    const sendMessage = () => {
        return producer
            .send({
                topic,
                // compression: CompressionTypes.GZIP,
                messages: Array(getRandomNumber())
                    .fill()
                    .map(_ => createMessage(getRandomNumber())),
            })
            .then(console.log)
            .catch(e => console.error(`[example/producer] ${e.message}`, e))
    }


    const run = async () => {
        await producer.connect()
        // setInterval(sendMessage, 3000)
        sendMessage()
    }

    run().catch(e => console.error(`[example/producer] ${e.message}`, e))

    const errorTypes = ['unhandledRejection', 'uncaughtException']
    const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

    errorTypes.map(type => {
        process.on(type, async () => {
            try {
                console.log(`process.on ${type}`)
                await producer.disconnect()
                process.exit(0)
            } catch (_) {
                process.exit(1)
            }
        })
    })

    signalTraps.map(type => {
        process.once(type, async () => {
            try {
                await producer.disconnect()
            } finally {
                process.kill(process.pid, type)
            }
        })
    })


    res.json([sendMessage]);
});

app.listen(3001, () => {
 console.log("Server running on port 3001");
});



