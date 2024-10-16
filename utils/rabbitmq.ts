import amqp from "amqplib";

const isDevelopment = process.env.NODE_ENV === "development";
const rabbitMQUrl = isDevelopment
  ? `amqp://${process.env.URL_DEV}`
  : `amqp://${process.env.URL_PROD}`;

export async function sendToRabbitMQ(queue: string, message: any) {
  let connection: amqp.Connection | null = null;
  let channel: amqp.Channel | null = null;

  try {
    console.log("RabbitMQ bağlantısı oluşturuluyor:", rabbitMQUrl);

    // Bağlantı ve kanal oluştur
    connection = await amqp.connect(rabbitMQUrl);
    channel = await connection.createChannel();

    // Kuyruğu oluştur (idempotent işlem)
    await channel.assertQueue(queue, { durable: true });

    // Mesajı kuyruğa gönder
    await channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });

    console.log(`Mesaj RabbitMQ kuyruğuna gönderildi: ${queue}`);
  } catch (error) {
    console.error("RabbitMQ'ya mesaj gönderimi başarısız:", error);
    throw error; // Hatayı tekrar fırlat
  } finally {
    // Kanalı ve bağlantıyı kapat
    if (channel) await channel.close();
    if (connection) await connection.close();
  }
}
