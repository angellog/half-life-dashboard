import { NFCProduct } from "@/types";

export const nfcProducts: NFCProduct[] = [
  {
    id: "nfc-standard",
    name: "Standard Smart Card",
    price: 100000,
    description:
      "Premium NFC-enabled business card with 2 custom branded profiles. Tap any smartphone to instantly share your digital presence.",
    features: [
      "2 custom branded profiles",
      "NFC tap-to-share technology",
      "Premium matte card design",
      "QR code backup on reverse",
      "Unlimited taps — no battery needed",
      "Works with iPhone & Android",
      "Custom logo & brand colors",
      "Digital analytics dashboard",
    ],
    isUpgrade: false,
  },
  {
    id: "nfc-metallic",
    name: "Metallic Smart Card",
    price: 35000,
    description:
      "Premium metal finish upgrade. A sleek, durable metallic card that commands attention and makes a lasting impression at every meeting.",
    features: [
      "Premium brushed metal finish",
      "Enhanced durability — scratch resistant",
      "Executive look & feel",
      "Same NFC technology",
      "Custom laser engraving option",
      "Heavier weight — premium tactile feel",
      "Available in Black, Silver, Gold",
      "Comes with protective sleeve",
    ],
    isUpgrade: true,
  },
];

export interface NFCOrder {
  id: string;
  customerName: string;
  businessName: string;
  phone: string;
  email: string;
  product: string;
  addMetallic: boolean;
  status: "pending" | "designing" | "printing" | "shipped" | "delivered";
  orderDate: string;
  total: number;
}

export const recentOrders: NFCOrder[] = [
  {
    id: "ORD-001",
    customerName: "David Mukasa",
    businessName: "Sole Republic UG",
    phone: "+256 700 123 456",
    email: "david@solerepublic.ug",
    product: "Standard Smart Card",
    addMetallic: true,
    status: "delivered",
    orderDate: "2026-04-15",
    total: 135000,
  },
  {
    id: "ORD-002",
    customerName: "Grace Nambi",
    businessName: "Street Luxe Kampala",
    phone: "+256 780 234 567",
    email: "grace@streetluxe.co",
    product: "Standard Smart Card",
    addMetallic: false,
    status: "shipped",
    orderDate: "2026-04-28",
    total: 100000,
  },
  {
    id: "ORD-003",
    customerName: "Brian Ochieng",
    businessName: "Kicks & Culture",
    phone: "+256 750 345 678",
    email: "brian@kicksculture.ug",
    product: "Standard Smart Card",
    addMetallic: true,
    status: "printing",
    orderDate: "2026-05-03",
    total: 135000,
  },
  {
    id: "ORD-004",
    customerName: "Aisha Nakato",
    businessName: "Drip Studio",
    phone: "+256 770 456 789",
    email: "aisha@dripstudio.com",
    product: "Standard Smart Card",
    addMetallic: false,
    status: "designing",
    orderDate: "2026-05-08",
    total: 100000,
  },
  {
    id: "ORD-005",
    customerName: "Samuel Kizza",
    businessName: "Vintage Vault KLA",
    phone: "+256 760 567 890",
    email: "sam@vintagevault.ug",
    product: "Standard Smart Card",
    addMetallic: true,
    status: "pending",
    orderDate: "2026-05-11",
    total: 135000,
  },
];

export const nfcStats = {
  totalOrders: 47,
  totalRevenue: 5285000,
  cardsDelivered: 38,
  metallicUpgradeRate: 62,
};

export function getNFCProducts(): NFCProduct[] {
  return nfcProducts;
}

export function getRecentOrders(): NFCOrder[] {
  return recentOrders;
}
