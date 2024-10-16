import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";

const SSH_USER = process.env.SSH_USER;
const SSH_HOST = process.env.SSH_HOST;
const PEM_PATH = process.env.PEM_PATH;

// PM2 komutunu oluşturma
const getPM2Command = () => {
  if (process.env.NODE_ENV === "development") {
    console.log(
      "Development mode: SSH ile sunucuya bağlanıp PM2 metriklerini alıyoruz."
    );
    return `ssh -i "${PEM_PATH}" ${SSH_USER}@${SSH_HOST} "source ~/.nvm/nvm.sh && pm2 jlist"`;
  } else {
    console.log(
      "Production mode: Sunucuda doğrudan PM2 komutunu çalıştırıyoruz."
    );
    return `pm2 jlist`;
  }
};

// Uptime hesaplama fonksiyonu
const calculateUptime = (pm_uptime: number): string => {
  const currentTime = Date.now();
  const uptimeDurationInMinutes = (currentTime - pm_uptime) / 60000;

  if (uptimeDurationInMinutes < 60) {
    return `${uptimeDurationInMinutes.toFixed(2)} dakika`;
  } else if (uptimeDurationInMinutes < 1440) {
    const hours = Math.floor(uptimeDurationInMinutes / 60);
    const minutes = Math.floor(uptimeDurationInMinutes % 60);
    return `${hours} saat ${minutes} dakika`;
  } else {
    const days = Math.floor(uptimeDurationInMinutes / 1440);
    const remainingMinutes = uptimeDurationInMinutes % 1440;
    const hours = Math.floor(remainingMinutes / 60);
    const minutes = Math.floor(remainingMinutes % 60);
    return `${days} gün ${hours} saat ${minutes} dakika`;
  }
};

// PM2 metrics API
export async function GET(req: NextRequest) {
  const commandToExecute = getPM2Command();

  return new Promise((resolve) => {
    exec(commandToExecute, { timeout: 10000 }, (error, stdout, stderr) => {
      if (error) {
        console.error("Metrics retrieval failed:", stderr);
        return resolve(
          NextResponse.json(
            { error: "Metrics retrieval failed" },
            { status: 500 }
          )
        );
      }
      try {
        const metrics = JSON.parse(stdout);

        const enhancedMetrics = metrics.map((service: any) => {
          if (
            service.pm2_env?.pm_uptime &&
            service.pm2_env.pm_uptime > 1000000000000
          ) {
            service.uptime = calculateUptime(service.pm2_env.pm_uptime);
          } else {
            service.uptime = "Geçersiz uptime değeri";
          }
          return service;
        });

        resolve(NextResponse.json(enhancedMetrics));
      } catch (parseError) {
        console.error("Error parsing metrics:", parseError);
        resolve(
          NextResponse.json({ error: "Error parsing metrics" }, { status: 500 })
        );
      }
    });
  });
}
