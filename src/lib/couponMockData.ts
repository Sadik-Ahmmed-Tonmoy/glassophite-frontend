export type TCoupon = {
  id: string;
  code: string;
  discount: number;
  expiry: string;
  status: "Active" | "Expired";
};

export const initialCoupons: TCoupon[] = [
  {
    id: "CPN-101",
    code: "GLASSOPHITE10",
    discount: 10,
    expiry: "2026-12-31",
    status: "Active",
  },
  {
    id: "CPN-102",
    code: "SUMMER20",
    discount: 20,
    expiry: "2026-08-31",
    status: "Active",
  },
  {
    id: "CPN-103",
    code: "PREMIUMVIP",
    discount: 15,
    expiry: "2026-10-15",
    status: "Expired",
  },
];

export const getCoupons = (): TCoupon[] => {
  if (typeof window === "undefined") return initialCoupons;
  const stored = localStorage.getItem("glassophite_coupons");
  if (!stored) {
    localStorage.setItem("glassophite_coupons", JSON.stringify(initialCoupons));
    return initialCoupons;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error("Error parsing coupons from localStorage", e);
    return initialCoupons;
  }
};

export const saveCoupons = (coupons: TCoupon[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("glassophite_coupons", JSON.stringify(coupons));
  }
};
