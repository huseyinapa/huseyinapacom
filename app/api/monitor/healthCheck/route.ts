// pages/api/monitor/healthCheck.ts

import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { sendSMSNotification } from "@/services/notificationService"; // SMS ve e-posta gönderimi için kullanılan fonksiyon

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Health check başlatıldı...");

  try {
    // Ana site sağlık kontrolü
    const siteHealth = await axios.get("https://huseyinapa.com/api/health");
    if (siteHealth.data.status === "DOWN") {
      await sendSMSNotification(
        "Ana site sağlıksız durumda! Acil müdahale gerekiyor."
      );
    }

    // API sağlık kontrolü
    const apiHealth = await axios.get("https://huseyinapa.com/api/health/api");
    if (apiHealth.data.status === "DOWN") {
      await sendSMSNotification(
        "API sağlıksız durumda! Acil müdahale gerekiyor."
      );
    }

    // PM2 süreç sağlık kontrolü
    const pm2Health = await axios.get("https://huseyinapa.com/api/health/pm2");
    if (pm2Health.data.status === "DOWN") {
      await sendSMSNotification(
        "PM2 süreçlerinden biri sağlıksız durumda! Kontrol ediniz."
      );
    }

    console.log("Health Check tamamlandı ve sistem sağlıklı.");
    res.status(200).json({ status: "Health checks completed successfully." });
  } catch (error) {
    console.error("Health check sırasında hata:", error);
    await sendSMSNotification(
      "Health check sırasında hata oluştu. Kontrol ediniz."
    );
    res.status(500).json({ error: "Health check failed." });
  }
}
