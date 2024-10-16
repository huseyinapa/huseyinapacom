import { NextRequest, NextResponse } from "next/server";
import { sendSMSNotification } from "@/services/notificationService"; // SMS ve e-posta gönderimi için yardımcı fonksiyonlar
import axios from "axios";

// Webhook handler
const eventProcessesMap: { [key: string]: string[] } = {
  restart: [],
  stop: [],
  delete: [],
  start: [],
  unhandledException: [],
  memoryLimitExceeded: [],
};

const smsTimeouts: { [key: string]: NodeJS.Timeout | null } = {
  restart: null,
  stop: null,
  delete: null,
  start: null,
  unhandledException: null,
  memoryLimitExceeded: null,
};

export async function POST(req: NextRequest) {
  try {
    const event = await req.json();

    // Olay detaylarını loglama (uygulama adı, durum, zaman bilgisi vs.)
    console.log("PM2 Webhook Event:", event);

    if (req.method !== "POST") {
      return NextResponse.json(
        { message: "Method Not Allowed" },
        { status: 405 }
      );
    }

    // Olayı işleme ve SMS gönderimi
    if (event && event.process && event.process.name) {
      const appName = event.process.name;
      const eventType = event.event;

      if (eventType in eventProcessesMap) {
        eventProcessesMap[eventType].push(appName);

        // Eğer zaten bir SMS gönderimi zamanlayıcısı varsa, onu temizleyip yeniden başlat
        if (smsTimeouts[eventType]) {
          clearTimeout(smsTimeouts[eventType]!);
        }

        // Belirli bir süre sonunda (örneğin 5 saniye) SMS gönderimini tetikleyin
        smsTimeouts[eventType] = setTimeout(async () => {
          await sendGroupedSms(eventType, eventProcessesMap[eventType]);
          eventProcessesMap[eventType] = [];
          smsTimeouts[eventType] = null;
        }, 5000);
      } else {
        console.log("Unknown event type:", eventType);
      }

      // Eğer olay türü "stop" veya "errored" ise, müdahale işlemini tetikle
      if (eventType === "stop" || eventType === "errored") {
        try {
          const webhookUrl =
            process.env.NODE_ENV === "development"
              ? `http://localhost:3000/api/interventionHandler`
              : `/api/interventionHandler`;
          console.log("Müdahale işlemi tetikleniyor:", webhookUrl);

          await axios.post(webhookUrl, {
            action: "restart",
            processName: appName,
          });
        } catch (error) {
          console.error("Müdahale işlemi başarısız oldu:", error);
        }
      }
    }

    // Yanıt döndürme
    return NextResponse.json({
      message: "Webhook event processed successfully.",
    });
  } catch (error) {
    console.error("Webhook event processing failed:", error);
    return NextResponse.json(
      { error: "Webhook event processing failed." },
      { status: 500 }
    );
  }
}

async function sendGroupedSms(eventType: string, processes: string[]) {
  if (processes.length > 0) {
    let message = `Olay Türü: ${eventType}
Uygulamalar: ${processes.join(", ")}
Zaman: ${new Date().toLocaleString()}`;

    switch (eventType) {
      case "restart":
        message += `\nNot: Uygulamalar yeniden başlatıldı. Kontrol ediniz.`;
        break;
      case "stop":
        message += `\nUygulamalar durduruldu. Müdahale gerekiyor olabilir.`;
        break;
      case "start":
        message += `\nUygulamalar başlatıldı.`;
        break;
      case "delete":
        message += `\nUygulamalar silindi.`;
        break;
      case "unhandledException":
        message += `\nUygulamalarda yakalanmamış bir hata oluştu. Kontrol ediniz.`;
        break;
      case "memoryLimitExceeded":
        message += `\nUygulamalarda bellek sınırı aşıldı. Bellek kullanımını gözden geçirin.`;
        break;
      default:
        message += `\nBilinmeyen olay türü.`;
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
