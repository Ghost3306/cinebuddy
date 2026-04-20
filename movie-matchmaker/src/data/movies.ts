export interface Movie {
  id: number;
  title: string;
  year: number;
  genre: string;
  rating: number;
  poster: string;
  description: string;
}

export const movies: Movie[] = [
  { id: 1, title: "Silent Horizon", year: 2024, genre: "Drama", rating: 8.3, poster: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=600&fit=crop", description: "A contemplative journey through the mountains." },
  { id: 2, title: "The Last Symphony", year: 2023, genre: "Drama", rating: 8.4, poster: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=600&fit=crop", description: "A musician's final masterpiece." },
  { id: 3, title: "Neon Pursuit", year: 2024, genre: "Action", rating: 7.9, poster: "https://images.unsplash.com/photo-1533928298208-27ff66555d8d?w=400&h=600&fit=crop", description: "High-speed chases through a neon-lit city." },
  { id: 4, title: "Quantum Break", year: 2023, genre: "Sci-Fi", rating: 8.1, poster: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=600&fit=crop", description: "Time fractures threaten reality itself." },
  { id: 5, title: "Whispers in the Dark", year: 2024, genre: "Horror", rating: 7.5, poster: "https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=400&h=600&fit=crop", description: "An old mansion hides terrifying secrets." },
  { id: 6, title: "Love in Paris", year: 2023, genre: "Romance", rating: 7.8, poster: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=600&fit=crop", description: "Two strangers meet on the streets of Paris." },
  { id: 7, title: "Steel Fortress", year: 2024, genre: "Action", rating: 8.0, poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop", description: "A lone soldier defends an impenetrable fortress." },
  { id: 8, title: "Starbound", year: 2023, genre: "Sci-Fi", rating: 8.6, poster: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=600&fit=crop", description: "Humanity's first interstellar voyage." },
  { id: 9, title: "The Comedian", year: 2024, genre: "Comedy", rating: 7.2, poster: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=400&h=600&fit=crop", description: "A stand-up comedian faces his biggest audience." },
  { id: 10, title: "Echoes of War", year: 2023, genre: "Drama", rating: 8.7, poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop", description: "The aftermath of conflict through survivors' eyes." },
  { id: 11, title: "Midnight Run", year: 2024, genre: "Thriller", rating: 7.6, poster: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=400&h=600&fit=crop", description: "A detective races against the clock." },
  { id: 12, title: "The Garden", year: 2023, genre: "Romance", rating: 8.2, poster: "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=400&h=600&fit=crop", description: "Love blooms in an unexpected place." },
];

export const genres = ["Action", "Drama", "Sci-Fi", "Horror", "Romance", "Comedy", "Thriller"];

export function searchMovies(genre: string): Movie[] {
  const q = genre.toLowerCase().trim();
  if (!q) return [];
  return movies.filter(m => m.genre.toLowerCase().includes(q));
}
