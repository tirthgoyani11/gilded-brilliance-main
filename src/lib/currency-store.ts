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
    // Use browser APIs to guess currency without network requests (avoids CORS, 429, 403)
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const locale = navigator.language || "";
    
    let currency = "USD";
    
    // Check timezone first, as it's more accurate than language preference
    if (tz === "Asia/Kolkata" || tz === "Asia/Calcutta") currency = "INR";
    else if (tz.startsWith("Europe/London")) currency = "GBP";
    else if (tz.startsWith("Europe/")) currency = "EUR";
    else if (tz.startsWith("Australia/")) currency = "AUD";
    else if (tz.startsWith("America/Toronto") || tz.startsWith("America/Vancouver")) currency = "CAD";
    else if (tz.startsWith("Asia/Dubai")) currency = "AED";
    else if (tz.startsWith("Asia/Singapore")) currency = "SGD";
    // Fallback to locale if timezone didn't match a specific currency
    else if (locale.endsWith("-IN")) currency = "INR";
    else if (locale.endsWith("-GB")) currency = "GBP";
    else if (locale.endsWith("-FR") || locale.endsWith("-DE")) currency = "EUR";
    else if (locale.endsWith("-AU")) currency = "AUD";
    else if (locale.endsWith("-CA")) currency = "CAD";
    else if (locale.endsWith("-AE")) currency = "AED";
    else if (locale.endsWith("-SG")) currency = "SGD";

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
