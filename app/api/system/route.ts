// pages/api/system.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { sendToRabbitMQ } from "@/utils/rabbitmq"; // RabbitMQ bağlantısı
import { services } from "@/utils/services";

// RabbitMQ kuyruğuna bağlantı ve mesaj gönderme
const sendRabbitMQ = async (queue: string, message: object) => {
  try {
    await sendToRabbitMQ(queue, Buffer.from(JSON.stringify(message)));
    console.log("RabbitMQ'ya mesaj gönderildi:", message);
  } catch (error) {
    console.error("RabbitMQ'ya mesaj gönderilemedi:", error);
  }
};

// PM2 süreçlerinin sağlık kontrolünü yapıp müdahale başlatma
export async function POST(req: NextRequest) {
  try {
    // Öncelikle sistemin sağlığını kontrol ediyoruz

    // Servislerin durumunu kontrol et
    for (const service of services) {
      let status = "Operational";

      try {
        await axios.get(service.url);
      } catch (error) {
        status = "Down";
        console.error(`${service.name} kullanılamıyor!`);
        // Eğer durum "Down" ise RabbitMQ'ya olayı ekleyelim ve müdahale başlatalım
        await sendRabbitMQ("pm2-events", {
          event: "service_down",
          serviceName: service.name,
          timestamp: new Date(),
        });

        // Müdahale başlat
        console.log(`${service.name} için müdahale başlatılıyor...`);
        await initiateIntervention(service.name);
      }
    }

    return NextResponse.json({ message: "Sistem kontrolü tamamlandı." });
  } catch (error) {
    console.error("Sistem kontrolü hatası:", error);
    return NextResponse.json(
      { error: "Sistem kontrolü hatası oluştu." },
      { status: 500 }
    );
  }
}

// PM2 müdahale fonksiyonu
const initiateIntervention = async (processName: string) => {
  try {
    await axios.post("/api/interventionHandler", {
      action: "restart",
      processName,
    });

    // RabbitMQ'ya müdahale kaydedelim
    await sendToRabbitMQ("pm2-events", {
      event: "intervention_started",
      processName,
      timestamp: new Date(),
    });

    console.log(
      `Müdahale ${processName} için başlatıldı ve RabbitMQ'ya kaydedildi.`
    );
  } catch (error) {
    console.error("Müdahale işlemi başarısız oldu:", error);
  }
};
