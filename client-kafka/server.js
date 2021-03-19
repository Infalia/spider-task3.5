//require('dotenv').config();
const WebSocketServer = require('websocket').server;
const { Kafka, logLevel } = require('kafkajs');
const http = require('http');
const {
  KAFKA_HOST,
  KAFKA_TOPIC
} = process.env;


const host = `${KAFKA_HOST}`; // process.env.HOST_IP || ip.address()

const kafka = new Kafka({
    logLevel: logLevel.INFO,
    brokers: [host],
    clientId: 'kafkajs-consumer'
});




const server = http.createServer(function(request, response) {
    console.log('Request recieved: ' + request.url);
    response.writeHead(404);
    response.end();
});

server.listen(3000, function() {
    console.log('Listening on port: 3000');
});
    
webSocketServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});
    
function iSOriginAllowed(origin) {
    return true;
}
    
webSocketServer.on('request', function(request) {
    if (!iSOriginAllowed(request.origin)) {
        request.reject();
        console.log('Connection from: ' + request.origin + ' rejected.');
        return;
    }
    
    const connection = request.accept('echo-protocol', request.origin);
    console.log('Connection accepted: ' + request.origin);

    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
        }
    });




    const topic = `${KAFKA_TOPIC}`;
    const consumer = kafka.consumer({ groupId: 'test-group' });

    const run = async () => {
        await consumer.connect();
        await consumer.subscribe({ topic, fromBeginning: true });
        await consumer.run({
            // eachBatch: async ({ batch }) => {
            //   console.log(batch)
            // },
            eachMessage: async ({ topic, partition, message }) => {
                const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
                console.log(`- ${prefix} ${message.key}#${message.value}`)

                connection.sendUTF(message.value);
            },
        });
    }
    
    run().catch(e => console.error(`[example/consumer] ${e.message}`, e))




    connection.on('close', function(reasonCode, description) {
        console.log('Connection ' + connection.remoteAddress + ' disconnected.');
    });
});