// utils/pm2Helper.ts

import { exec } from "child_process";
import { sendSMSNotification } from "@/services/notificationService";

export function executePM2Command(
  action: string,
  processName: string,
  retryCount = 0,
  maxRetries = 2
) {
  const validActions = ["restart", "stop", "start", "delete", "status"];
  if (!validActions.includes(action)) {
    throw new Error(
      `Geçersiz aksiyon: ${action}. Geçerli aksiyonlar: ${validActions.join(
        ", "
      )}`
    );
  }

  const command = `pm2 ${action} ${processName}`;
  console.log(`Executing command: ${command}`);

  exec(command, async (error, stdout, stderr) => {
    if (error) {
      console.error(`PM2 ${action} komutu başarısız oldu:`, stderr);

      if (retryCount < maxRetries) {
        console.log(`Yeniden deneme (${retryCount + 1}/${maxRetries})...`);
        executePM2Command(action, processName, retryCount + 1, maxRetries);
      } else {
        console.error(
          `Yeniden başlatma denemeleri başarısız oldu: ${processName}`
        );
        const message = `Uygulama: ${processName}\nAksiyon: ${action}\nDurum: Yeniden başlatma başarısız.\nLütfen müdahale ediniz.`;

        // SMS gönderimi
        await sendSMSNotification(message);
      }
    } else {
      console.log(`PM2 ${action} komutu başarılı:`, stdout);
    }
  });
}
