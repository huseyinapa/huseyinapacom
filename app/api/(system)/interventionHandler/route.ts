import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";

const SSH_USER = process.env.SSH_USER;
const SSH_HOST = process.env.SSH_HOST;
const PEM_PATH = process.env.PEM_PATH;

let manualActions: Record<string, boolean> = {};

// PM2 komutunu oluşturma
const getCommandToExecute = (action: string, processName: string) => {
  if (process.env.NODE_ENV === "development") {
    if (!SSH_USER || !SSH_HOST || !PEM_PATH) {
      throw new Error(
        "SSH bilgileri eksik. Lütfen SSH_USER, SSH_HOST ve PEM_PATH ortam değişkenlerini kontrol edin."
      );
    }
    console.log(
      "Development mode: SSH kullanarak uzaktaki sunucuya bağlanılıyor."
    );
    return `ssh -i "${PEM_PATH}" ${SSH_USER}@${SSH_HOST} "source ~/.nvm/nvm.sh && pm2 ${action} ${processName}"`;
  } else {
    console.log(
      "Production mode: Sunucuda doğrudan PM2 komutunu çalıştırıyoruz."
    );
    return `pm2 ${action} ${processName}`;
  }
};

// PM2 komutunu çalıştır ve kaydet
const executePM2Command = (
  command: string,
  processName: string,
  action: string
) => {
  exec(command, async (error, stdout, stderr) => {
    if (error) {
      console.error("PM2 intervention failed:", stderr);
      // RabbitMQ'ya başarısızlığı kaydet
      // await sendToRabbitMQ("pm2-events", {
      //   event: "intervention_failed",
      //   processName,
      //   action,
      //   timestamp: new Date(),
      // });
      return;
    }
    console.log("PM2 intervention success:", stdout);
    // RabbitMQ'ya başarıyı kaydet
    // await sendToRabbitMQ("pm2-events", {
    //   event: "intervention_succeeded",
    //   processName,
    //   action,
    //   timestamp: new Date(),
    // });
  });
};

export async function POST(req: NextRequest) {
  try {
    const { action, processName } = await req.json();

    if (!action || !processName) {
      return NextResponse.json(
        { message: "Action and processName are required" },
        { status: 400 }
      );
    }

    // Eğer manuel olarak 'stop' komutu verildiyse, müdahale etmemek için durumu kontrol ediyoruz
    if (
      manualActions[processName] &&
      (action === "restart" || action === "start")
    ) {
      return NextResponse.json(
        {
          message:
            "Manual stop detected, intervention aborted to prevent conflict.",
        },
        { status: 400 }
      );
    }

    // PM2 komutunu oluştur ve çalıştır
    const commandToExecute = getCommandToExecute(action, processName);
    executePM2Command(commandToExecute, processName, action);

    // RabbitMQ'ya müdahale başlatıldı mesajı gönder
    // await sendToRabbitMQ("pm2-events", {
    //   event: "intervention_started",
    //   processName,
    //   action,
    //   timestamp: new Date(),
    // });

    // Eğer manuel bir müdahale yapılıyorsa, durumu kaydet
    if (action === "stop") {
      manualActions[processName] = true;
    } else {
      manualActions[processName] = false;
    }

    return NextResponse.json({
      message: "PM2 intervention decision made successfully.",
    });
  } catch (error) {
    console.error("Error in intervention handler:", error);
    return NextResponse.json(
      { error: "Error in intervention handler", details: error },
      { status: 500 }
    );
  }
}
