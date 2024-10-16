import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Prisma veritabanı bağlantısı

export async function GET(req: NextRequest) {
  try {
    const services = await prisma.service.findMany({
      include: {
        logs: {
          orderBy: {
            date: "desc",
          },
          take: 90, // Son 90 günü alıyoruz
        },
      },
    });

    const serviceTimelines = services.map((service) => {
      const statusDays = service.logs.map((log) => ({
        date: log.date.toISOString().split("T")[0],
        status: log.status,
      }));

      // Uptime yüzdesi hesaplama
      const operationalDays = statusDays.filter(
        (day) => day.status === "Operational"
      ).length;
      const uptimePercentage = ((operationalDays / 90) * 100).toFixed(2) + "%";

      return {
        serviceName: service.name,
        uptimePercentage,
        statusDays,
      };
    });

    return NextResponse.json(serviceTimelines, { status: 200 });
  } catch (error) {
    console.error("Error in service status retrieval:", error);
    return NextResponse.json(
      { error: "Service status logs retrieval failed." },
      { status: 500 }
    );
  }
}
