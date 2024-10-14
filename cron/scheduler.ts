// cron/scheduler.js

import cron from "node-cron";
import axios from "axios";

// Her 5 dakikada bir sağlık kontrolünü tetikle
cron.schedule("*/5 * * * *", async () => {
  try {
    console.log("Health check tetikleyici çalıştırılıyor...");
    await axios.get("/api/monitor/healthCheck");
  } catch (error) {
    console.error("Health check tetiklenemedi:", error);
  }
});
