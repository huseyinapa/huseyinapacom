import amqp from "amqplib";

let connection;
let channel: amqp.Channel;

const isDevelopment = process.env.NODE_ENV === "development";
const rabbitMQUrl = isDevelopment
  ? process.env.RABBITMQ_URL_DEV
  : process.env.RABBITMQ_URL_PROD;

export async function connectRabbitMQ() {
  try {
    connection = await amqp.connect(rabbitMQUrl);
    channel = await connection.createChannel();

    // Kuyruk oluşturulurken dayanıklı olarak ayarlıyoruz
    await channel.assertQueue("unhealthy_service", { durable: true });
  } catch (error) {
    console.error("RabbitMQ bağlantısı başarısız:", error);
  }
}

export async function sendToRabbitMQ(queue: string, message: any) {
  try {
    if (!channel) {
      await connectRabbitMQ();
    }

    // Mesajı kalıcı olacak şekilde kuyruğa gönderiyoruz
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });
    console.log(`Mesaj RabbitMQ kuyruğuna gönderildi: ${queue}`);
  } catch (error) {
    console.error("RabbitMQ'ya mesaj gönderimi başarısız:", error);
  }
}
