import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma"; // Prisma veritabanı bağlantısı

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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

    res.status(200).json(serviceTimelines);
  } catch (error) {
    res.status(500).json({ error: "Service status logs retrieval failed." });
  }
}
