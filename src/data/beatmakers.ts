export type BeatTag = "Tendance" | "Nouveau" | "Populaire" | null;

export type BeatFixture = {
  id: number;
  name: string;
  artist: string;
  genre: string;
  bpm: number;
  key: string;
  tag: BeatTag;
  audio: string;
  price: number;
};

export type BeatmakerFixture = {
  id: number;
  name: string;
  avatar?: string;
  city?: string;
  specialties: string[];
  sales: number;
  avgPrice: number;
  heat: number;
  instagram?: string;
  youtube?: string;
  email?: string;
  rating: number;
  beats: BeatFixture[];
};

export const AUDIO_PLACEHOLDER = "/audio/Woke up late, still rich from yesterday  (Remix) (Instrumental) (1).mp3";

const baseBeatmakers: Array<Omit<BeatmakerFixture, "avgPrice">> = [
  {
    id: 1,
    name: "Nova Wave",
    avatar: "/img/newwave.png",
    city: "Paris",
    specialties: ["Trap", "R&B"],
    sales: 742,
    heat: 910,
    instagram: "https://www.instagram.com/beatmakerz_pro/",
    youtube: "https://www.youtube.com/@BEATMAKERZ-PRO",
    email: "nova@beatmakerz.com",
    rating: 4.8,
    beats: [
      { id: 101, name: "Skyline Drift", artist: "Nova Wave", genre: "Trap", bpm: 142, key: "Fm", tag: "Tendance", audio: AUDIO_PLACEHOLDER, price: 24.99 },
      { id: 102, name: "Night Pulse", artist: "Nova Wave", genre: "Trap", bpm: 150, key: "Gm", tag: "Populaire", audio: AUDIO_PLACEHOLDER, price: 29.99 },
      { id: 103, name: "Velvet Echo", artist: "Nova Wave", genre: "R&B", bpm: 96, key: "Cm", tag: "Nouveau", audio: AUDIO_PLACEHOLDER, price: 21.0 },
      { id: 104, name: "Neon Sparks", artist: "Nova Wave", genre: "Trap", bpm: 138, key: "Am", tag: null, audio: AUDIO_PLACEHOLDER, price: 26.5 },
      { id: 105, name: "Glasshouse", artist: "Nova Wave", genre: "R&B", bpm: 102, key: "Dm", tag: null, audio: AUDIO_PLACEHOLDER, price: 22.5 },
    ],
  },
  {
    id: 2,
    name: "Midnight Echo",
    avatar: "/img/melancolique.png",
    city: "Bruxelles",
    specialties: ["Lofi", "Boom Bap"],
    sales: 508,
    heat: 640,
    instagram: "https://www.instagram.com/beatmakerz_pro/",
    youtube: "https://www.youtube.com/@BEATMAKERZ-PRO",
    email: "echo@beatmakerz.com",
    rating: 4.6,
    beats: [
      { id: 201, name: "Late Shift", artist: "Midnight Echo", genre: "Lofi", bpm: 82, key: "Gm", tag: "Nouveau", audio: AUDIO_PLACEHOLDER, price: 18.99 },
      { id: 202, name: "Dusty Lights", artist: "Midnight Echo", genre: "Boom Bap", bpm: 92, key: "Bm", tag: null, audio: AUDIO_PLACEHOLDER, price: 20.99 },
      { id: 203, name: "City Static", artist: "Midnight Echo", genre: "Lofi", bpm: 78, key: "Fm", tag: "Populaire", audio: AUDIO_PLACEHOLDER, price: 17.49 },
      { id: 204, name: "Analog Dreams", artist: "Midnight Echo", genre: "Boom Bap", bpm: 88, key: "Em", tag: null, audio: AUDIO_PLACEHOLDER, price: 19.5 },
      { id: 205, name: "Moonrise", artist: "Midnight Echo", genre: "Lofi", bpm: 75, key: "Cm", tag: null, audio: AUDIO_PLACEHOLDER, price: 16.5 },
    ],
  },
  {
    id: 3,
    name: "Urban Mirage",
    avatar: "/img/kick.png",
    city: "Lyon",
    specialties: ["West Coast", "Trap"],
    sales: 865,
    heat: 1020,
    instagram: "https://www.instagram.com/beatmakerz_pro/",
    youtube: "https://www.youtube.com/@BEATMAKERZ-PRO",
    email: "mirage@beatmakerz.com",
    rating: 4.9,
    beats: [
      { id: 301, name: "Sunset Highway", artist: "Urban Mirage", genre: "West Coast", bpm: 100, key: "Bb", tag: "Tendance", audio: AUDIO_PLACEHOLDER, price: 32.0 },
      { id: 302, name: "Fast Lane", artist: "Urban Mirage", genre: "Trap", bpm: 152, key: "C#m", tag: "Populaire", audio: AUDIO_PLACEHOLDER, price: 27.5 },
      { id: 303, name: "Chrome City", artist: "Urban Mirage", genre: "West Coast", bpm: 94, key: "Gm", tag: null, audio: AUDIO_PLACEHOLDER, price: 30.0 },
      { id: 304, name: "Sidewalk Heat", artist: "Urban Mirage", genre: "Trap", bpm: 160, key: "Am", tag: null, audio: AUDIO_PLACEHOLDER, price: 28.99 },
      { id: 305, name: "Horizon Line", artist: "Urban Mirage", genre: "Trap", bpm: 145, key: "Fm", tag: null, audio: AUDIO_PLACEHOLDER, price: 26.0 },
    ],
  },
  {
    id: 4,
    name: "Blue Garden",
    avatar: "/img/newwave.png",
    city: "Marseille",
    specialties: ["R&B", "New Wave"],
    sales: 412,
    heat: 520,
    instagram: "https://www.instagram.com/beatmakerz_pro/",
    youtube: "https://www.youtube.com/@BEATMAKERZ-PRO",
    email: "bluegarden@beatmakerz.com",
    rating: 4.5,
    beats: [
      { id: 401, name: "Purple Bloom", artist: "Blue Garden", genre: "R&B", bpm: 92, key: "Fm", tag: "Nouveau", audio: AUDIO_PLACEHOLDER, price: 23.0 },
      { id: 402, name: "Slow Aurora", artist: "Blue Garden", genre: "New Wave", bpm: 110, key: "Dm", tag: null, audio: AUDIO_PLACEHOLDER, price: 25.5 },
      { id: 403, name: "Soft Neon", artist: "Blue Garden", genre: "R&B", bpm: 98, key: "Cm", tag: null, audio: AUDIO_PLACEHOLDER, price: 21.5 },
      { id: 404, name: "Liquid Shape", artist: "Blue Garden", genre: "New Wave", bpm: 118, key: "Am", tag: "Tendance", audio: AUDIO_PLACEHOLDER, price: 27.99 },
      { id: 405, name: "Serenity", artist: "Blue Garden", genre: "R&B", bpm: 104, key: "Gm", tag: null, audio: AUDIO_PLACEHOLDER, price: 22.5 },
    ],
  },
  {
    id: 5,
    name: "Shadow Beats",
    avatar: "/img/melancolique.png",
    city: "Toulouse",
    specialties: ["Drill", "Trap"],
    sales: 690,
    heat: 870,
    instagram: "https://www.instagram.com/beatmakerz_pro/",
    youtube: "https://www.youtube.com/@BEATMAKERZ-PRO",
    email: "shadow@beatmakerz.com",
    rating: 4.7,
    beats: [
      { id: 501, name: "Cold Streets", artist: "Shadow Beats", genre: "Drill", bpm: 142, key: "F#m", tag: "Tendance", audio: AUDIO_PLACEHOLDER, price: 31.99 },
      { id: 502, name: "Burning Ice", artist: "Shadow Beats", genre: "Trap", bpm: 150, key: "G#m", tag: null, audio: AUDIO_PLACEHOLDER, price: 27.5 },
      { id: 503, name: "Deep Walk", artist: "Shadow Beats", genre: "Drill", bpm: 144, key: "Dm", tag: "Populaire", audio: AUDIO_PLACEHOLDER, price: 30.0 },
      { id: 504, name: "Steel Rain", artist: "Shadow Beats", genre: "Trap", bpm: 148, key: "Em", tag: null, audio: AUDIO_PLACEHOLDER, price: 26.75 },
      { id: 505, name: "Echo Blade", artist: "Shadow Beats", genre: "Drill", bpm: 140, key: "Cm", tag: null, audio: AUDIO_PLACEHOLDER, price: 28.0 },
    ],
  },
  {
    id: 6,
    name: "Golden Tape",
    avatar: "/img/kick.png",
    city: "Nice",
    specialties: ["Boom Bap", "Soul"],
    sales: 328,
    heat: 480,
    instagram: "https://www.instagram.com/beatmakerz_pro/",
    youtube: "https://www.youtube.com/@BEATMAKERZ-PRO",
    email: "golden@beatmakerz.com",
    rating: 4.4,
    beats: [
      { id: 601, name: "Retro Lines", artist: "Golden Tape", genre: "Boom Bap", bpm: 90, key: "Bb", tag: "Nouveau", audio: AUDIO_PLACEHOLDER, price: 19.99 },
      { id: 602, name: "Soul Steps", artist: "Golden Tape", genre: "Soul", bpm: 88, key: "Eb", tag: null, audio: AUDIO_PLACEHOLDER, price: 22.0 },
      { id: 603, name: "Cassette Sun", artist: "Golden Tape", genre: "Boom Bap", bpm: 94, key: "Gm", tag: null, audio: AUDIO_PLACEHOLDER, price: 20.5 },
      { id: 604, name: "Night Market", artist: "Golden Tape", genre: "Soul", bpm: 92, key: "Fm", tag: null, audio: AUDIO_PLACEHOLDER, price: 23.5 },
      { id: 605, name: "Tape Echo", artist: "Golden Tape", genre: "Boom Bap", bpm: 98, key: "Cm", tag: "Populaire", audio: AUDIO_PLACEHOLDER, price: 21.75 },
    ],
  },
];

export const BEATMAKERS: BeatmakerFixture[] = baseBeatmakers.map((bm) => {
  const average = bm.beats.reduce((acc, beat) => acc + beat.price, 0) / bm.beats.length;
  return {
    ...bm,
    avgPrice: Number(average.toFixed(2)),
  };
});

export const CATALOGUE_BEATS: BeatFixture[] = BEATMAKERS.flatMap((bm) => bm.beats);
