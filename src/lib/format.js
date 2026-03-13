export const formatCurrency = (amount = 0) => {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
};

export const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatCompactNumber = (value = 0) => {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(Number(value) || 0);
};

export const getDiscountedPrice = (price = 0, discount = 0) => {
  const safePrice = Number(price) || 0;
  const safeDiscount = Number(discount) || 0;
  return safePrice - (safePrice * safeDiscount) / 100;
};

export const getStatusTone = (status = "pending") => {
  const tones = {
    pending: "badge-warning",
    pending_payment: "badge-warning",
    processing: "badge-info",
    shipped: "badge-primary",
    delivered: "badge-success",
    cancelled: "badge-error",
    paid: "badge-success",
    failed: "badge-error",
  };
  return tones[status] || "badge-ghost";
};
