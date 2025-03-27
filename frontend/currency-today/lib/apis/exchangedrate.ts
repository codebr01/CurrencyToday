import { useEffect, useState } from "react";

export function useExchangeRate() {
  const [rate, setRate] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const API_KEY = import.meta.env.VITE_API_EXCHANGE;
        const response = await fetch(
          `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`
        );
        const data = await response.json();
        setRate(data.conversion_rates); // Save all conversion rates
      } catch (error) {
        console.error("Erro ao buscar a cotação:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRate();
  }, []);

  return { rate, loading };
}
