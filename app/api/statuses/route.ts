import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { ServiceStatus } from "@/app/types/status"; // Yolunuzu ayarlayın
import { services } from "@/utils/services"; // Yolunuzu ayarlayın

export async function GET(req: NextRequest) {
  try {
    const statuses: ServiceStatus[] = await Promise.all(
      services.map(async (service) => {
        let isOnline = false;
        let details = null;

        try {
          const response = await axios.get(service.url);
          isOnline = response.status === 200;
        } catch {
          isOnline = false;
        }

        if (isOnline && service.statusApi) {
          try {
            const statusResponse = await axios.get(service.statusApi);
            console.log(statusResponse.data);
            details = statusResponse.data;
          } catch {
            details = { error: "Durum bilgisi alınamadı." };
          }
        }

        return { ...service, isOnline, details };
      })
    );

    return NextResponse.json(statuses, { status: 200 });
  } catch (error) {
    console.error("Error in health check:", error);
    return NextResponse.json({ error: "Health check failed" }, { status: 500 });
  }
}
