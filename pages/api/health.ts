import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma"; // Veritabanı bağlantısını kontrol etmek için örnek
import { services } from "@/utils/services"; // Servisleri içe aktarma

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const healthChecks = await Promise.all(
      services.map(
        async (service: { url: string | URL | Request; name: any }) => {
          try {
            const response = await fetch(service.url);
            if (response.status === 200) {
              return { name: service.name, status: "UP" };
            }
            return { name: service.name, status: "DOWN" };
          } catch (error) {
            return {
              name: service.name,
              status: "DOWN",
              error: (error as Error).message,
            };
          }
        }
      )
    );

    // Genel sistemin sağlık durumu kontrolü
    const allHealthy = healthChecks.every(
      (check: { status: string }) => check.status === "UP"
    );

    if (allHealthy) {
      res.status(200).json({ status: "UP", services: healthChecks });
    } else {
      res.status(503).json({ status: "DOWN", services: healthChecks });
    }
  } catch (error) {
    console.error("Health check failed:", error);
    res
      .status(500)
      .json({ status: "DOWN", message: "Service is currently unavailable" });
  }
}
