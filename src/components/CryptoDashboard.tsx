import React, { useEffect, useState } from "react";
import SelectInput from "./SelectInput";
import type { SingleValue } from "react-select";
import logo from "../assets/crypto_price_checker.png";

type Coin = { id: string; symbol: string; name: string };
type PriceResponse = { price: number };

const formatter = new Intl.DisplayNames(["en"], { type: "currency" });

export default function CryptoDashboard() {
  const apiUrl = import.meta.env.VITE_GO_CRYPTO_API_URL || "http://localhost:8080";

  const [coins, setCoins] = useState<Coin[]>([]);
  const [coin, setCoin] = useState<Coin | null>(null);
  const [currency, setCurrency] = useState<{ value: string; label: string }>({
    value: "usd",
    label: formatter.of("usd") ?? "USD",
  });
  const [timezone, setTimezone] = useState<{ value: string; label: string }>(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return { value: tz, label: tz };
  });

  const [timezones, setTimezones] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${apiUrl}/coins`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch coins");
        return res.json();
      })
      .then((data: Coin[]) => {
        setCoins(data);
        const defaultCoin = data.find((c) => c.id === "bitcoin") ?? data[0];
        setCoin(defaultCoin ?? null);
      })
      .catch((err) => setError(err.message));

    setTimezones(Intl.supportedValuesOf("timeZone"));
  }, [apiUrl]);

  const coinOptions = coins.map((c) => ({
    value: c.id,
    label: `${c.name} (${c.symbol.toUpperCase()})`,
  }));

  const currencyOptions = ["usd", "eur", "jpy", "gbp", "aud"].map((c) => ({
    value: c,
    label: formatter.of(c) ?? c.toUpperCase(),
  }));

  const timezoneOptions = timezones.map((tz) => ({ value: tz, label: tz }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coin) return;

    setLoading(true);
    setPrice(null);
    setError(null);

    const url = `${apiUrl}/price?coin=${coin.id}&currency=${currency.value}&timezone=${timezone.value}`;
    try {
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error(`Expected JSON but got: ${text.substring(0, 200)}`);
      }
      const data: PriceResponse = await res.json();
      setPrice(data.price);
    } catch (err: any) {
      if (err.message.includes("429")) {
        setError("Too many requests — please slow down and try again in a moment.");
      } else {
        setError(err.message || "Unknown error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 p-4">

      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-xl space-y-6 w-full max-w-md shadow-lg"
      >

        <div className="space-y-2">
          <img
            src={logo}
            alt="Logo"
            height={250}
            width={250}
            style={{ borderRadius: "8px", alignContent: "center", display: "block", margin: "0 auto" }}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-white font-medium">🪙 Coin</label>
          <SelectInput
            options={coinOptions}
            value={coin ? { value: coin.id, label: `${coin.name} (${coin.symbol.toUpperCase()})` } : null}
            onChange={(selected: SingleValue<{ value: string; label: string }>) => {
              if (selected) {
                const found = coins.find((c) => c.id === selected.value);
                setCoin(found ?? null);
              } else {
                setCoin(null);
              }
            }}
            placeholder="Select a coin"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-white font-medium">💸 Currency</label>
          <SelectInput
            options={currencyOptions}
            value={currency}
            onChange={(selected) => selected && setCurrency(selected)}
            placeholder="Select a currency"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-white font-medium">🕒 Timezone</label>
          <SelectInput
            options={timezoneOptions}
            value={timezone}
            onChange={(selected: SingleValue<{ value: string; label: string }>) => {
              if (selected) setTimezone(selected);
            }}
            placeholder="Select a timezone"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Getting..." : "Get Price"}
        </button>

        {price !== null && (
          <div className="mt-4 text-xl text-white font-semibold text-center">
            Price: {price.toLocaleString(undefined, { style: "currency", currency: currency.value }) + "📈"}
          </div>
        )}

        {error && (
          <p className="mt-4 text-red-500 font-semibold text-center">
            Error: {error}
          </p>
        )}


      </form>
    </div>
  );
}
