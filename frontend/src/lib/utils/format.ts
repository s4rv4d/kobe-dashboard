export function formatUSD(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatBalance(value: number): string {
  if (value < 0.0001) return "< 0.0001";
  if (value < 1) return value.toFixed(4);
  if (value < 1000) return value.toFixed(2);
  return new Intl.NumberFormat("en-US").format(Math.round(value));
}

export function resolveIpfs(url: string | undefined): string {
  if (!url) return "";
  if (url.startsWith("ipfs://")) {
    return url.replace("ipfs://", "https://cloudflare-ipfs.com/ipfs/");
  }
  return url;
}

export function formatCompactUSD(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(2)}K`;
  }
  return formatUSD(value);
}

export function formatDate(dateString: string): string {
  const [day, month, year] = dateString.split("/").map(Number);

  const date = new Date(year, month - 1, day);

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}
