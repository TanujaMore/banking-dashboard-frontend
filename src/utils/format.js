export const formatINR = (value) => {
  const number = Number(value);

  if (isNaN(number)) return value; // safety fallback

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(number);
};
