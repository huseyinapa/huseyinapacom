import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma"; // Prisma veritabanı bağlantısı
import { services } from "@/utils/services";

export async function POST(req: NextRequest) {
  try {
    for (const service of services) {
      let status = "Operational";
      let duration = null;
      let issue = null;

      // Hizmetin durumunu kontrol et
      const startTime = Date.now();
      try {
        await axios.get(service.url);
      } catch (error) {
        status = "Partial Outage";
        duration = `${((Date.now() - startTime) / 1000).toFixed(2)} seconds`;
        issue = "Kullanılamıyor";
      }

      if (status === "Operational" && service.statusApi) {
        try {
          const statusResponse = await axios.get(service.statusApi);
          if (statusResponse.data.database === false) {
            status = "Partial Outage";
            issue = "Veritabanı bağlantı hatası";
          }
        } catch {
          status = "Partial Outage";
          issue = "Durum API'sine ulaşılamadı";
        }
      }

      // Hizmeti veritabanına ekle veya güncelle
      const existingService = await prisma.service.findFirst({
        where: {
          name: service.name,
        },
      });

      if (!existingService) {
        // Eğer hizmet daha önce eklenmemişse, yeni ekle
        await prisma.service.create({
          data: {
            name: service.name,
            url: service.url,
            statusApi: service.statusApi,
            category: service.category,
            logs: {
              create: {
                status,
                duration,
                issue,
                date: new Date(),
              },
            },
          },
        });
      } else {
        // Eğer hizmet zaten varsa, durumu güncelle
        await prisma.service.update({
          where: {
            id: existingService.id,
          },
          data: {
            logs: {
              create: {
                status,
                duration,
                issue,
                date: new Date(),
              },
            },
          },
        });
      }
    }

    return NextResponse.json({
      message: "Service statuses updated successfully.",
    });
  } catch (error) {
    console.error("Hizmet durumları güncellenemedi:", error);
    return NextResponse.json(
      { error: "Service status update failed." },
      { status: 500 }
    );
  }
}
