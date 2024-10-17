// api/system.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { services } from "@/utils/services";
import { url } from "@/utils/api";

// PM2 müdahale fonksiyonu
const initiateIntervention = async (processName: string) => {
  try {
    await axios.post(`${url}/api/interventionHandler`, {
      action: "restart",
      processName,
    });
    console.log(`Müdahale ${processName} için başlatıldı.`);
  } catch (error) {
    console.error("Müdahale işlemi başarısız oldu:", error);
  }
};

// Sistem kontrolü ve müdahale başlatma
export async function GET() {
  try {
    let healthData;

    try {
      // api/health endpoint'ine istek gönder
      const healthResponse = await axios.get(`${url}/api/health`);
      healthData = healthResponse.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Eğer hata 503 ise, healthData'yı error.response.data'dan alabiliriz
        if (error.response.status === 503) {
          healthData = error.response.data;
        } else {
          // Başka bir hata ise, hatayı tekrar fırlat
          throw error;
        }
      } else {
        throw error;
      }
    }

    console.log("Sistem kontrolü:", healthData);

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
    if (axios.isAxiosError(error)) {
      console.error("Sistem kontrolü hatası:", error.response?.data);
    } else {
      console.error("Sistem kontrolü hatası:", error);
    }
    return NextResponse.json(
      { error: "Sistem kontrolü hatası oluştu." },
      { status: 500 }
    );
  }
}
