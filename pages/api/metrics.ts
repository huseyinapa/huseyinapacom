import type { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

const SSH_USER = "ubuntu"; // SSH kullanıcı adı
const SSH_HOST = "3.130.155.44"; // Sunucu IP adresi veya alan adı
const PEM_PATH = "C:/Users/admin/Desktop/servers/huseyinapa/huseyinapa.pem"; // PEM dosyasının tam yolu (örneğin: /Users/admin/.ssh/huseyinapa.pem)
const PM2_COMMAND_SSH = `ssh -i "${PEM_PATH}" ${SSH_USER}@${SSH_HOST} "source ~/.nvm/nvm.sh && pm2 jlist"`; // PEM dosyasını kullanarak sunucuya bağlan ve nvm ortamını yükledikten sonra pm2 jlist komutunu çalıştır
const PM2_COMMAND_LOCAL = `pm2 jlist`; // PM2 komutunu sunucuda doğrudan çalıştır

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  let commandToExecute: string;

  if (process.env.NODE_ENV === "development") {
    console.log(
      "Development mode: SSH ile sunucuya bağlanıp PM2 metriklerini alıyoruz."
    );
    // Development modunda, SSH kullanarak uzak sunucuya bağlan
    commandToExecute = PM2_COMMAND_SSH;
  } else {
    console.log(
      "Production mode: Sunucuda doğrudan PM2 komutunu çalıştırıyoruz."
    );
    // Production modunda, sunucuda doğrudan PM2 komutunu çalıştır
    commandToExecute = PM2_COMMAND_LOCAL;
  }

  // Belirlenen komutu çalıştırıyoruz
  exec(commandToExecute, (error, stdout, stderr) => {
    if (error) {
      console.error("Metrics retrieval failed:", stderr);
      return res.status(500).json({ error: "Metrics retrieval failed" });
    }
    try {
      const metrics = JSON.parse(stdout);
      res.status(200).json(metrics);
    } catch (parseError) {
      console.error("Error parsing metrics:", parseError);
      res.status(500).json({ error: "Error parsing metrics" });
    }
  });
}
