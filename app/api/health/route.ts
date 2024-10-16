import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Veritabanı bağlantısını kontrol etmek için örnek
import { services } from "@/utils/services"; // Servisleri içe aktarma

export async function GET(req: NextRequest) {
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
      return NextResponse.json(
        { status: "UP", services: healthChecks },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { status: "DOWN", services: healthChecks },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      { status: "DOWN", message: "Service is currently unavailable" },
      { status: 500 }
    );
  }
}
