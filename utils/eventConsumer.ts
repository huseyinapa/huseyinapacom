import amqp from "amqplib";
import { executePM2Command } from "@/utils/pm2Helper";
import { sendSMSNotification } from "@/services/notificationService";

const SERVICE_NAME = "RabbitMQ Event Consumer"; // Müdahale eden servis adı

export async function startEventConsumer() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    // Kuyruk dayanıklı olarak tanımlanmıştır
    await channel.assertQueue("unhealthy_service", { durable: true });

    channel.consume("unhealthy_service", async (msg) => {
      if (msg !== null) {
        const event = JSON.parse(msg.content.toString());
        console.log("RabbitMQ'dan gelen olay:", event);

        const { serviceName } = event;

        // Sağlıksız servisi yeniden başlatmaya çalış
        try {
          await executePM2Command("restart", serviceName);

          // Başarılı müdahale bildirimleri
          const successMessage = `Servis: ${serviceName} başarıyla yeniden başlatıldı.\nMüdahale Eden Servis: ${SERVICE_NAME}`;
          console.log(successMessage);
          await sendSMSNotification(successMessage);

          // Başarıyla işlenmişse mesajı onaylıyoruz
          channel.ack(msg);
        } catch (error) {
          // Başarısız müdahale bildirimleri
          const failureMessage = `Servis: ${serviceName} yeniden başlatılamadı. Müdahale Eden Servis: ${SERVICE_NAME}\nManuel müdahale gerekebilir. Hata: ${
            (error as Error).message
          }`;
          console.error(failureMessage);
          await sendSMSNotification(failureMessage);
          // Başarısızsa mesajı onaylamıyoruz, bu yüzden RabbitMQ mesajı kuyruğa geri koyacaktır
          channel.nack(msg, false, true);
        }
      }
    });
  } catch (error) {
    console.error("RabbitMQ Event Consumer başlatılamadı:", error);
  }
}
