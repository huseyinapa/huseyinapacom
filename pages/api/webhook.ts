import type { NextApiRequest, NextApiResponse } from "next";
import { sendSMSNotification } from "@/services/notificationService"; // SMS ve e-posta gönderimi için yardımcı fonksiyonlar

// Webhook handler
const eventProcessesMap: { [key: string]: string[] } = {
  restart: [],
  stop: [],
  delete: [],
  start: [],
  unhandledException: [],
  memoryLimitExceeded: [],
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(req.method);

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const event = req.body;

    // Olay detaylarını loglama (uygulama adı, durum, zaman bilgisi vs.)
    console.log("PM2 Webhook Event:", event);

    // Olayı işleme ve SMS gönderimi
    if (event && event.process && event.process.name) {
      const appName = event.process.name;
      const eventType = event.event;

      if (eventType in eventProcessesMap) {
        eventProcessesMap[eventType].push(appName);
        await sendGroupedSms(eventType, eventProcessesMap[eventType]);
        eventProcessesMap[eventType] = [];
      } else {
        console.log("Unknown event type:", eventType);
      }
    }

    // Yanıt döndürme
    res.status(200).json({ message: "Webhook event processed successfully." });
  } catch (error) {
    console.error("Webhook event processing failed:", error);
    res.status(500).json({ error: "Webhook event processing failed." });
  }
}

async function sendGroupedSms(eventType: string, processes: string[]) {
  if (processes.length > 0) {
    let message = `Olay Türü: ${eventType}
Uygulamalar: ${processes.join(", ")}
Zaman: ${new Date().toLocaleString()}`;

    switch (eventType) {
      case "restart":
        message += `
Not: Uygulamalar yeniden başlatıldı. Kontrol ediniz.`;
        break;
      case "stop":
        message += `
Uygulamalar durduruldu. Müdahale gerekiyor olabilir.`;
        break;
      case "start":
        message += `
Uygulamalar başlatıldı.`;
        break;
      case "delete":
        message += `
Uygulamalar silindi.`;
        break;
      case "unhandledException":
        message += `
Uygulamalarda yakalanmamış bir hata oluştu. Kontrol ediniz.`;
        break;
      case "memoryLimitExceeded":
        message += `
Uygulamalarda bellek sınırı aşıldı. Bellek kullanımını gözden geçirin.`;
        break;
      default:
        message += `
Bilinmeyen olay türü.`;
    }

    // SMS gönderimi (Örnek Twilio fonksiyonu)
    let retryCount = 0;
    const maxRetries = 3;
    let smsSent = false;

    while (retryCount < maxRetries && !smsSent) {
      try {
        await sendSMSNotification(message);
        smsSent = true;
      } catch (error) {
        console.log(
          `SMS gönderimi başarısız oldu. Tekrar deneme: ${retryCount + 1}`,
          error
        );
        retryCount++;
        if (retryCount === maxRetries) {
          console.error("SMS gönderimi başarısız oldu.");
          // await sendEmailNotification("SMS Gönderim Başarısızlığı", message);
        }
      }
    }
  }
}
