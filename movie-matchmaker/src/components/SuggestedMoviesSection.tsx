import { useMemo, useState } from "react";
import { Star, X } from "lucide-react";
import { motion } from "framer-motion";

const moviePool = [
  {
    id: 1339876,
    title: "Mardaani 3",
    genre: "Action, Crime",
    rating: "7.4",
    description:
      "Officer Shivani Shivaji Roy returns to hunt down those behind the disappearance of young girls, risking everything to bring them back alive.",
    image:
      "https://image.tmdb.org/t/p/w500/dHxLBtHw4InwsVumnthupZYz6NM.jpg",
  },
  {
    id: 1582770,
    title: "Dhurandhar: The Revenge",
    genre: "Action, Crime",
    rating: "7.7",
    description:
      "As rival gangs, corrupt officials and a ruthless Major Iqbal close in, Hamza's mission spirals into a bloody personal war.",
    image:
      "https://image.tmdb.org/t/p/w500/ptTwQES14pr5c3aZvJg56YlYgb1.jpg",
  },
  {
    id: 656908,
    title: "Ramayana",
    genre: "Fantasy, Drama",
    rating: "8.0",
    description:
      "An ancient epic follows a young prince and princess whose marriage and exile begin a legendary journey.",
    image:
      "https://image.tmdb.org/t/p/w500/f3yZZw7zIsWo6m9xJStfjDauIZX.jpg",
  },
  {
    id: 1282440,
    title: "Happy Patel: Khatarnak Jasoos",
    genre: "Comedy, Action",
    rating: "8.1",
    description:
      "An MI7 operative in Goa uncovers his Indian roots while trying to rescue a scientist from a dangerous crime lord.",
    image:
      "https://image.tmdb.org/t/p/w500/tZJBXGNyDanSne6a2TLRU45Uhwu.jpg",
  },
  {
    id: 1022453,
    title: "The Rajasaab",
    genre: "Horror, Fantasy",
    rating: "5.2",
    description:
      "A young man enters a haunted mansion searching for his grandfather and awakens a terrifying family curse.",
    image:
      "https://image.tmdb.org/t/p/w500/nvK6gYa4diCnQkDVN42uoYXPrdT.jpg",
  },
  {
    id: 1213898,
    title: "Border 2",
    genre: "War, Drama",
    rating: "6.4",
    description:
      "Three idealistic soldiers in the army, navy and air force face grueling combat during the 1971 war.",
    image:
      "https://image.tmdb.org/t/p/w500/wUcttG71zo9deP4m9sDhYPUcvi5.jpg",
  },
  {
    id: 1213243,
    title: "Toxic",
    genre: "Thriller, Action",
    rating: "7.0",
    description:
      "Set in Goa, this gripping tale explores the dangerous underworld of a powerful drug cartel.",
    image:
      "https://image.tmdb.org/t/p/w500/tZ8eSBXbza96vzCYeVTG9RBJ78E.jpg",
  },
  {
    id: 1122030,
    title: "Alpha",
    genre: "Action, Spy",
    rating: "7.8",
    description:
      "Two fierce female agents tackle dangerous missions in a thrilling world of espionage.",
    image:
      "https://image.tmdb.org/t/p/w500/iMJPXq0t8XiXrfOm7j9tlaeCQSM.jpg",
  },
  {
    id: 1145110,
    title: "King",
    genre: "Action, Thriller",
    rating: "7.3",
    description:
      "Mentor and disciple embark on a perilous journey, pushing survival skills to the limit.",
    image:
      "https://image.tmdb.org/t/p/w500/74fHULlTBMGGLusfFBVAkMAZbce.jpg",
  },
  {
    id: 1235877,
    title: "Jana Nayagan",
    genre: "Sci-Fi, Drama",
    rating: "7.5",
    description:
      "A former police officer is drawn into a battle of ideologies after a child's fear awakens the past.",
    image:
      "https://image.tmdb.org/t/p/w500/jt8pfSIdi47YpFMMWVRr8w5u2S0.jpg",
  },
  {
    id: 965483,
    title: "Parasakthi",
    genre: "Historical, Drama",
    rating: "6.0",
    description:
      "A ruthless officer hunts rebels while two brothers are caught in a fierce battle for justice.",
    image:
      "https://image.tmdb.org/t/p/w500/cpKJGYU8Z1iSXzkgDl8vhazk5EQ.jpg",
  },
  {
    id: 1300501,
    title: "Patriot",
    genre: "Spy Thriller",
    rating: "7.1",
    description:
      "Covert operatives uncover a surveillance conspiracy threatening national security.",
    image:
      "https://image.tmdb.org/t/p/w500/5LHrtudEt6Mh6VlfGHoYqqjVOHV.jpg",
  },
];

const shuffleMovies = (movies: typeof moviePool) => {
  return [...movies].sort(() => Math.random() - 0.5).slice(0, 4);
};

const SuggestedMoviesSection = ({ isLoggedIn }) => {
  const [selectedMovie, setSelectedMovie] = useState<any>(null);

  const suggestedMovies = useMemo(() => shuffleMovies(moviePool), []);

  if (!isLoggedIn) return null;

  return (
    <section className="relative w-full px-6 md:px-12 py-20 border-t border-border bg-background overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-primary mb-2">
            Personalized For You
          </p>

          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">
            Suggested Movies
          </h2>

          <p className="text-muted-foreground mt-3 max-w-2xl">
            Based on your recently watched genres and interests, here are some
            movies you may enjoy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {suggestedMovies.map((movie, index) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              whileHover={{ y: -8 }}
              className="group overflow-hidden rounded-3xl border border-border bg-card/70 backdrop-blur-xl shadow-sm hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative overflow-hidden h-[320px]">
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-70" />
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm px-3 py-1 rounded-full bg-secondary/80 backdrop-blur-md text-secondary-foreground">
                    {movie.genre}
                  </span>

                  <div className="flex items-center gap-1 text-sm text-yellow-500 font-medium">
                    <Star size={14} fill="currentColor" />
                    {movie.rating}
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-card-foreground mb-2">
                  {movie.title}
                </h3>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {movie.description}
                </p>

                <button
                  onClick={() => setSelectedMovie(movie)}
                  className="w-full rounded-xl bg-primary text-primary-foreground py-2 font-medium hover:opacity-90 transition"
                >
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {selectedMovie && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full max-w-md rounded-3xl bg-card border border-border shadow-2xl overflow-hidden"
            >
              <div className="relative h-56">
                <img
                  src={selectedMovie.image}
                  alt={selectedMovie.title}
                  className="w-full h-full object-cover"
                />

                <button
                  onClick={() => setSelectedMovie(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm">
                    {selectedMovie.genre}
                  </span>

                  <div className="flex items-center gap-1 text-yellow-500 font-medium">
                    <Star size={14} fill="currentColor" />
                    {selectedMovie.rating}
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-3 text-card-foreground">
                  {selectedMovie.title}
                </h3>

                <p className="text-muted-foreground leading-relaxed">
                  {selectedMovie.description}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SuggestedMoviesSection;