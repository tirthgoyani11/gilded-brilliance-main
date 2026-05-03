type CurrencyConfig = {
  currency: string;
  rate: number;
};

let config: CurrencyConfig = { currency: "USD", rate: 0.012 }; // Default fallback
let initialized = false;

export const getCurrencyConfig = () => config;

export const initCurrency = async (): Promise<void> => {
  if (initialized) return;
  
  try {
    const ipRes = await fetch("https://ipwho.is/");
    const ipData = await ipRes.json();
    const currency = ipData.currency?.code || "USD";

    if (currency === "INR") {
      config = { currency: "INR", rate: 1 };
      initialized = true;
      return;
    }

    const rateRes = await fetch("https://api.exchangerate-api.com/v4/latest/INR");
    const rateData = await rateRes.json();
    const rate = rateData.rates[currency] || (currency === "USD" ? 0.012 : 1);

    config = { currency, rate };
    initialized = true;
  } catch (error) {
    // If anything fails, fallback to USD
    try {
      const rateRes = await fetch("https://api.exchangerate-api.com/v4/latest/INR");
      const rateData = await rateRes.json();
      config = { currency: "USD", rate: rateData.rates["USD"] || 0.012 };
    } catch {
      config = { currency: "USD", rate: 0.012 };
    }
    initialized = true;
  }
};
