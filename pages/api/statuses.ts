import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { ServiceStatus } from "@/app/types/status"; // Yolunuzu ayarlayın
import { services } from "@/utils/services"; // Yolunuzu ayarlayın

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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

  res.status(200).json(statuses);
}
