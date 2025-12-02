const { kafka } = require("./users/kafka");



async function init(){

    const admin = kafka.admin();
    console.log("CONNECTING KAFKA ADMIN");
    await admin.connect();
    console.log("KAFKA ADMIN CONNECTED");

    // creating topics
    console.log("CREATING TOPICS");
    await admin.createTopics({
        topics:[
            {
            topic: 'user-created',
            numPartitions: 2
            },
            {
                topic: 'order-placed',
                numPartitions: 2
            }
    ]
    })
    console.log("TOPIC CREATED SUCCESSSFULLY");

    await admin.disconnect();
    console.log("KAFKA ADMIN DISCONNECTED");
}


init().then(() => {
    console.log("ADMIN SCRIPT COMPLETED");
}).catch((error) => {
    console.error("ERROR IN ADMIN SCRIPT:", error);
});