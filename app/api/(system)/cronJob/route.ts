import axios from "axios";
import { NextResponse } from "next/server";
import cron from "node-cron";

import { url } from "@/utils/api";

// Cron job'u sadece sunucu tarafında tanımlıyoruz, böylece frontend ile ilgisi olmuyor

export async function GET() {
  cron.schedule("1 */2 * * * *", async () => {
    try {
      console.log("Health check tetikleyici çalıştırılıyor...");

      await axios.get(`${url}/api/system`);
    } catch (error) {
      console.error("Health check tetiklenemedi:", error);
    }
  });
  return NextResponse.json({ message: "Cron job başlatıldı ve çalışıyor." });
}
