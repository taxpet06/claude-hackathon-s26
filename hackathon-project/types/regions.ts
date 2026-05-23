export type Region = {
  id: string;
  name: string;
  aliases: string[];
  coords: [number, number]; // [lng, lat]
  genre: string;
  pinColor: string;
  country: string; // ISO 3166-1 alpha-2, used for iTunes charts
};
