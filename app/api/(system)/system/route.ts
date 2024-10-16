// api/system.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { services } from "@/utils/services";
import { url } from "../cronJob/route";

// PM2 müdahale fonksiyonu
const initiateIntervention = async (processName: string) => {
  try {
    await axios.post(`${url}/api/interventionHandler`, {
      action: "restart",
      processName,
    });
    console.log(
      `Müdahale ${processName} için başlatıldı.` // ve RabbitMQ'ya kaydedildi.
    );
  } catch (error) {
    console.error("Müdahale işlemi başarısız oldu:", error);
  }
};

// Sistem kontrolü ve müdahale başlatma
export async function POST(req: NextRequest) {
  try {
    // api/health endpoint'ine istek gönder
    const healthResponse = await axios.get(`${url}/api/health`);
    const healthData = healthResponse.data;

    // Eğer sistem DOWN ise, ilgili servisler için müdahale başlat
    if (healthData.status === "DOWN") {
      // Servis isimlerini servis nesneleriyle eşleştirmek için bir harita oluştur
      const serviceMap = new Map(services.map((s) => [s.name, s]));

      for (const serviceStatus of healthData.services) {
        if (serviceStatus.status === "DOWN") {
          console.error(`${serviceStatus.name} kullanılamıyor!`);

          const service = serviceMap.get(serviceStatus.name);
          if (service) {
            // Müdahale başlat
            console.log(`${service.name} için müdahale başlatılıyor...`);
            await initiateIntervention(service.service_name);
          } else {
            console.error(
              `Service ${serviceStatus.name} servis listesinde bulunamadı.`
            );
          }
        }
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
