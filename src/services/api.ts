export async function fetchCoins(apiUrl: string) {
  const res = await fetch(`${apiUrl}/coins`);
  if (!res.ok) throw new Error(`Failed to fetch coins: ${res.statusText}`);
  return res.json();
}

export async function fetchPrice(apiUrl: string, coin: string, currency: string, timezone: string) {
  const url = `${apiUrl}/price?coin=${coin}&currency=${currency}&timezone=${timezone}`;
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
  return res.json();
}
