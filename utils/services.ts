import { Service } from "@/app/types/status"; // Yolunuzu ayarlayın

export const services: Service[] = [
  {
    name: "Ana Site",
    url: "https://www.huseyinapa.com",
    statusApi: "https://www.gonenkleopatra.com/status.php",
    category: "Website",
  },
  {
    name: "Kleopatra",
    url: "https://www.gonenkleopatra.com",
    statusApi: "https://www.gonenkleopatra.com/status.php",
    category: "Website",
  },
  {
    name: "Kleopatra Ödeme",
    url: "https://api.gonenkleopatra.com",
    statusApi: "https://www.gonenkleopatra.com/status.php",
    category: "Ödeme",
  },
  {
    name: "Gülgönen",
    url: "https://www.gulgonenkoop.com",
    statusApi: "https://www.gonenkleopatra.com/status.php",
    category: "Website",
  },
  {
    name: "Gülgönen API",
    url: "https://api.gulgonenkoop.com",
    statusApi: "https://www.gonenkleopatra.com/status.php",
    category: "API",
  },
];
