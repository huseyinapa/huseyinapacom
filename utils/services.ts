import { Service } from "@/types/status"; // Yolunuzu ayarlayın

export const services: Service[] = [
  {
    name: "Ana Site",
    service_name: "huseyinapa",
    url: "https://www.huseyinapa.com",
    statusApi: "https://www.gonenkleopatra.com/status.php",
    category: "Website",
  },
  {
    name: "Kleopatra",
    service_name: "kleopatra",
    url: "https://www.gonenkleopatra.com",
    statusApi: "https://www.gonenkleopatra.com/status.php",
    category: "Website",
  },
  {
    name: "Kleopatra Ödeme",
    service_name: "pay_kleopatra",
    url: "https://api.gonenkleopatra.com",
    statusApi: "https://www.gonenkleopatra.com/status.php",
    category: "Ödeme",
  },
  {
    name: "Gülgönen",
    service_name: "gulgonenkoop",
    url: "https://www.gulgonenkoop.com",
    statusApi: "https://www.gonenkleopatra.com/status.php",
    category: "Website",
  },
  {
    name: "Gülgönen API",
    service_name: "gulgonen_pay",
    url: "https://backend.gulgonenkoop.com",
    statusApi: "https://www.gonenkleopatra.com/status.php",
    category: "API",
  },
  {
    name: "Gülgönen Pay",
    service_name: "gulgonen_pay",
    url: "https://api.gulgonenkoop.com",
    statusApi: "https://www.gonenkleopatra.com/status.php",
    category: "API",
  },
];
