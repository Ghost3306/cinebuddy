import { Star } from "lucide-react";
import type { Movie } from "@/data/movies";

const MovieCard = ({ movie }: { movie: Movie }) => (
  <div className="group relative rounded-lg overflow-hidden cursor-pointer aspect-[4/3]">
    <img
      src={movie.poster}
      alt={movie.title}
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      loading="lazy"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
    <div className="absolute bottom-0 left-0 right-0 p-4">
      <h3 className="font-semibold text-lg text-foreground">{movie.title}</h3>
      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
        <span>{movie.year}</span>
        <span>•</span>
        <span>{movie.genre}</span>
        <span>•</span>
        <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
        <span>{movie.rating}</span>
      </div>
    </div>
  </div>
);

export default MovieCard;
