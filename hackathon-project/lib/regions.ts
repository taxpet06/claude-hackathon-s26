import { Region } from "@/types/regions";

export const REGIONS: Region[] = [
  { id: "US", name: "United States", aliases: ["usa", "us", "america", "united states", "new york", "los angeles"], coords: [-95.7, 37.1], genre: "Pop / Hip-Hop", pinColor: "#3B82F6", country: "US" },
  { id: "GB", name: "United Kingdom", aliases: ["uk", "united kingdom", "britain", "england", "london", "british"], coords: [-3.4, 54.4], genre: "UK Pop", pinColor: "#3B82F6", country: "GB" },
  { id: "FR", name: "France", aliases: ["france", "french", "paris", "marseille"], coords: [2.3, 46.2], genre: "French Pop", pinColor: "#6366F1", country: "FR" },
  { id: "DE", name: "Germany", aliases: ["germany", "german", "berlin", "munich"], coords: [10.5, 51.2], genre: "Schlager / Pop", pinColor: "#6B7280", country: "DE" },
  { id: "ES", name: "Spain", aliases: ["spain", "spanish", "madrid", "barcelona", "flamenco"], coords: [-3.7, 40.4], genre: "Latin / Flamenco", pinColor: "#EF4444", country: "ES" },
  { id: "IT", name: "Italy", aliases: ["italy", "italian", "rome", "milan", "italia"], coords: [12.6, 41.9], genre: "Italian Pop", pinColor: "#22C55E", country: "IT" },
  { id: "PT", name: "Portugal", aliases: ["portugal", "portuguese", "lisbon", "fado", "porto"], coords: [-8.2, 39.4], genre: "Fado / Pop", pinColor: "#EF4444", country: "PT" },
  { id: "SE", name: "Sweden", aliases: ["sweden", "swedish", "stockholm", "nordic", "scandinavian"], coords: [18.6, 62.2], genre: "Swedish Pop", pinColor: "#3B82F6", country: "SE" },
  { id: "RU", name: "Russia", aliases: ["russia", "russian", "moscow", "st petersburg"], coords: [60.0, 60.0], genre: "Russian Pop", pinColor: "#EF4444", country: "RU" },
  { id: "TR", name: "Turkey", aliases: ["turkey", "turkish", "istanbul", "ankara"], coords: [35.2, 38.9], genre: "Turkish Pop", pinColor: "#EF4444", country: "TR" },
  { id: "BR", name: "Brazil", aliases: ["brazil", "brasil", "rio", "sao paulo", "brazilian"], coords: [-51.9, -14.2], genre: "Funk / Sertanejo", pinColor: "#22C55E", country: "BR" },
  { id: "MX", name: "Mexico", aliases: ["mexico", "mexican", "mexico city", "monterrey"], coords: [-102.6, 23.6], genre: "Latin Pop", pinColor: "#EF4444", country: "MX" },
  { id: "CO", name: "Colombia", aliases: ["colombia", "colombian", "bogota", "medellin", "reggaeton", "cumbia"], coords: [-74.3, 4.6], genre: "Reggaeton / Cumbia", pinColor: "#F59E0B", country: "CO" },
  { id: "AR", name: "Argentina", aliases: ["argentina", "argentinian", "buenos aires", "tango"], coords: [-63.6, -38.4], genre: "Tango / Pop", pinColor: "#6366F1", country: "AR" },
  { id: "CL", name: "Chile", aliases: ["chile", "chilean", "santiago"], coords: [-71.5, -35.7], genre: "Pop / Rock", pinColor: "#EF4444", country: "CL" },
  { id: "JM", name: "Jamaica", aliases: ["jamaica", "jamaican", "reggae", "dancehall", "kingston"], coords: [-77.3, 18.1], genre: "Reggae / Dancehall", pinColor: "#22C55E", country: "JM" },
  { id: "NG", name: "Nigeria", aliases: ["nigeria", "nigerian", "afrobeats", "lagos", "abuja"], coords: [8.7, 9.1], genre: "Afrobeats", pinColor: "#F59E0B", country: "NG" },
  { id: "GH", name: "Ghana", aliases: ["ghana", "ghanaian", "accra", "highlife"], coords: [-1.0, 7.9], genre: "Highlife / Afropop", pinColor: "#F59E0B", country: "GH" },
  { id: "ZA", name: "South Africa", aliases: ["south africa", "johannesburg", "cape town", "amapiano"], coords: [25.1, -29.0], genre: "Amapiano / Afro", pinColor: "#F59E0B", country: "ZA" },
  { id: "KE", name: "Kenya", aliases: ["kenya", "kenyan", "nairobi", "bongo", "benga"], coords: [37.9, -0.1], genre: "Afropop / Bongo", pinColor: "#22C55E", country: "KE" },
  { id: "EG", name: "Egypt", aliases: ["egypt", "egyptian", "cairo", "arabic"], coords: [30.8, 26.8], genre: "Arabic Pop", pinColor: "#F59E0B", country: "EG" },
  { id: "SN", name: "West Africa", aliases: ["west africa", "senegal", "mali", "dakar", "afro house"], coords: [-12.4, 12.4], genre: "Afro House", pinColor: "#F59E0B", country: "SN" },
  { id: "IN", name: "India", aliases: ["india", "indian", "bollywood", "mumbai", "delhi"], coords: [78.9, 20.6], genre: "Bollywood", pinColor: "#F97316", country: "IN" },
  { id: "CN", name: "China", aliases: ["china", "chinese", "beijing", "shanghai", "c-pop", "mandarin"], coords: [104.2, 35.9], genre: "C-Pop / Mandopop", pinColor: "#EF4444", country: "CN" },
  { id: "JP", name: "Japan", aliases: ["japan", "japanese", "j-pop", "jpop", "tokyo", "osaka"], coords: [138.3, 36.2], genre: "J-Pop", pinColor: "#EC4899", country: "JP" },
  { id: "KR", name: "South Korea", aliases: ["korea", "south korea", "k-pop", "kpop", "seoul"], coords: [127.8, 35.9], genre: "K-Pop", pinColor: "#A855F7", country: "KR" },
  { id: "ID", name: "Indonesia", aliases: ["indonesia", "indonesian", "jakarta", "bali"], coords: [113.9, -0.8], genre: "Pop / Dangdut", pinColor: "#EF4444", country: "ID" },
  { id: "PH", name: "Philippines", aliases: ["philippines", "filipino", "manila", "opm"], coords: [121.8, 12.9], genre: "OPM", pinColor: "#3B82F6", country: "PH" },
  { id: "TH", name: "Thailand", aliases: ["thailand", "thai", "bangkok", "t-pop"], coords: [101.0, 15.9], genre: "T-Pop", pinColor: "#A855F7", country: "TH" },
  { id: "AU", name: "Australia", aliases: ["australia", "australian", "sydney", "melbourne", "aussie"], coords: [133.8, -25.3], genre: "Indie / Pop", pinColor: "#22C55E", country: "AU" },
];

export function findRegionByQuery(query: string): Region | undefined {
  const q = query.toLowerCase().trim();
  return REGIONS.find(
    (r) =>
      r.id.toLowerCase() === q ||
      r.name.toLowerCase() === q ||
      r.aliases.some((a) => a.includes(q) || q.includes(a))
  );
}

export function findRegionById(id: string): Region | undefined {
  return REGIONS.find((r) => r.id === id);
}
