// utils/notificationService.ts

import twilio from "twilio";

const accountSid = process.env.TW_ACCOUNT_SID!;
const authToken = process.env.TW_AUTH_TOKEN!;
const client = twilio(accountSid, authToken);

export async function sendSMSNotification(message: string) {
  try {
    const sms = await client.messages.create({
      body: message,
      from: "+14054588595", // Twilio numaranız
      to: process.env.MY_NUMBER!.toString(), // Hedef telefon numarası
    });
    console.log(`SMS sent: ${sms.sid}`);
  } catch (error) {
    console.error("SMS sending failed:", error);
  }
}
