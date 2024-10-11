import cron from "node-cron";
import axios from "axios";

cron.schedule("0 * * * *", async () => {
  // Her saat başında çalışacak şekilde ayarlanmıştır
  try {
    await axios.get("/api/updateServiceStatus");
    console.log("Service statuses updated");
  } catch (error) {
    console.error("Service status update failed:", error);
  }
});
