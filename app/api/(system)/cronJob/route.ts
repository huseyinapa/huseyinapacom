import axios from "axios";
import { NextResponse } from "next/server";
import cron from "node-cron";

// Cron job'u sadece sunucu tarafında tanımlıyoruz, böylece frontend ile ilgisi olmuyor
export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://www.huseyinapa.com";

export async function GET() {
  cron.schedule("1 */2 * * * *", async () => {
    try {
      console.log("Health check tetikleyici çalıştırılıyor...");

      await axios.post(`${url}/api/system`);
    } catch (error) {
      console.error("Health check tetiklenemedi:", error);
    }
  });
  return NextResponse.json({ message: "Cron job başlatıldı ve çalışıyor." });
}
