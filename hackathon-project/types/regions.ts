export type Region = {
  id: string;
  name: string;
  aliases: string[];
  coords: [number, number]; // [lng, lat]
  playlistId: string;
  genre: string;
  pinColor: string;
  country: string;
};
