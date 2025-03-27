import { useEffect, useState } from "react";
import { useExchangeRate } from "../lib/apis/exchangedrate";

function App() {
  const { rate, loading } = useExchangeRate();
  const [coins, setCoins] = useState<any[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("");

  const initialCoins = coins.slice(0, 4);
  const displayedCoins = showAll ? coins : initialCoins;

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await fetch("../lib/coins/coins.json");
        const data = await response.json();
        setCoins(data);
      } catch (error) {
        console.error("Erro ao carregar as moedas:", error);
      }
    };

    fetchCoins();
  }, []);

  const handleConvert = async () => {
    if (rate && rate[fromCurrency] && rate[toCurrency]) {
      const conversionRate = rate[toCurrency] / rate[fromCurrency];
      setConvertedAmount(amount * conversionRate);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value));
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>, type: "from" | "to") => {
    if (type === "from") {
      setFromCurrency(e.target.value.toUpperCase());
    } else {
      setToCurrency(e.target.value.toUpperCase());
    }
  };

  return (
    <>
      <div className="w-screen flex items-center text-2xl gap-4 p-4 font-mono bg-gray-200">
        <div>
          <p className="ml-4">Moeda Hoje</p>
        </div>
        <div className="flex gap-4 flex-grow justify-center">
          <button className="hover:bg-gray-300 cursor-pointer py-2 px-4 rounded">
            Cotação
          </button>
          <button className="hover:bg-gray-300 cursor-pointer py-2 px-4 rounded">
            Conversor
          </button>
        </div>
      </div>

      <div className="p-4">
        <h2 className="text-xl font-mono mb-2">Moedas</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayedCoins.length > 0 ? (
            displayedCoins.map((coin) => (
              <div
                key={coin.codigo}
                className="p-4 border rounded-lg shadow-md bg-white transition-transform duration-300 hover:scale-105"
              >
                <h3 className="text-lg font-semibold">{coin.nome}</h3>
                <p className="text-sm text-gray-600">Código: {coin.codigo}</p>
                <p className="text-sm text-gray-600">País: {coin.pais}</p>
              </div>
            ))
          ) : (
            <p>Carregando moedas...</p>
          )}
        </div>

        {coins.length > 4 && (
          <button
            className="mt-4 py-2 px-4 bg-gray-400 text-white rounded-lg hover:bg-gray-600"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Mostrar Menos" : "Mostrar Mais"}
          </button>
        )}
      </div>

      <div className="h-0.5 w-screen bg-gray-200"></div>

      {/* Conversor */}
      <div className="p-4 flex flex-col items-center">
        <h2 className="text-xl font-mono mb-2">Conversor de Moeda</h2>
        <div className="flex flex-col gap-4 mb-4">
          <div>
            <label htmlFor="fromCurrency" className="block text-sm font-medium">De:</label>
            <input
              id="fromCurrency"
              type="text"
              value={fromCurrency}
              onChange={(e) => handleCurrencyChange(e, "from")}
              className="px-4 py-2 border rounded-lg w-70"
              placeholder="Digite o código da moeda. Ex: USD"
            />
          </div>

          <div>
            <label htmlFor="toCurrency" className="block text-sm font-medium">Para:</label>
            <input
              id="toCurrency"
              type="text"
              value={toCurrency}
              onChange={(e) => handleCurrencyChange(e, "to")}
              className="px-4 py-2 border rounded-lg w-70"
              placeholder="Digite o código da moeda. Ex: BRL"
            />
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="flex items-center gap-4">
            <div>
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={handleAmountChange}
                className="border rounded-lg w-30 px-3 py-3"
                placeholder="Valor"
              />
            </div>

            <div>
              <button
                onClick={handleConvert}
                className="bg-gray-400 text-white hover:bg-gray-600 px-3 py-3 border rounded-lg"
              >
                Converter
              </button>
            </div>
          </div>
        </div>

        {convertedAmount !== null && (
          <div>
            <p className="text-lg font-semibold">
              {amount} {fromCurrency} é igual a {convertedAmount.toFixed(2)} {toCurrency}
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
