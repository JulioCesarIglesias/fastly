export const formatCurrencyInCents = (amount: number, showCurrency = true) => {
  return new Intl.NumberFormat("pt-BR", {
    style: showCurrency ? "currency" : "decimal",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(amount / 100);
};
