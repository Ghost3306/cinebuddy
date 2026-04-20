
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { Search, X, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MovieCard from "@/components/MovieCard";
import { Button } from "@/components/ui/button";


const SearchResults = () => {
  const location = useLocation();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const filters = location.state?.filters || {};
  const text =
  [
    filters.text,
    filters.genre,
    filters.sort,
    filters.year,
    filters.language,
    filters.rating
  ]
    .filter(Boolean)
    .join(" ") || params.get("text") || ""; 

  const [query, setQuery] = useState(text);
  const [results, setResults] = useState<any[]>(
  location.state?.filteredMovies || []
);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const savedUserUuid = localStorage.getItem("user_uuid");
  const userId = localStorage.getItem("user_uuid");
  useEffect(() => {
  if (location.state?.filteredMovies) {
    setResults(location.state.filteredMovies);
    return;
  }

  const fetchMovies = async () => {
    if (!text.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/users/recommend-movies/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            'user_id':savedUserUuid,
            text: text,
            top_n: 20,
          }),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setResults(data.results);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error(error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  fetchMovies();
}, [text, location.state]);


  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?text=${encodeURIComponent(query.trim())}`);
    }
  };

  const submitReview = async () => {
    if (!userId) {
      alert("Please login first");
      return;
    }

    if (!selectedMovie) {
      alert("No movie selected");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/users/add-movie-rating/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            movie_id: selectedMovie.id,
            movie_name: selectedMovie.title,
            rating: reviewRating,
            review: reviewText,
          }),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        alert("Review added successfully");

        setReviewText("");
        setReviewRating(5);

        setSelectedMovie((prev: any) => ({
          ...prev,
          user_review: reviewText,
          user_rating: reviewRating,
        }));
      } else {
        alert(data.message || "Failed to add review");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong while adding review");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main
        className="flex-1 max-w-7xl mx-auto w-full px-6 pt-24 pb-16"
        style={{ marginTop: "var(--nav-height)" }}
      >
        <div className="flex items-center gap-2 bg-secondary rounded-lg px-4 py-3 max-w-2xl">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none"
            placeholder="Search movies..."
          />

          <button
            onClick={handleSearch}
            className="bg-primary text-primary-foreground p-2 rounded-md"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        <h2 className="font-display text-3xl md:text-4xl mt-8 tracking-wide">
          Results for "{text}"
        </h2>

        <p className="text-muted-foreground text-sm mt-1">
          {loading ? "Searching..." : `Found ${results.length} movies`}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {results.map((movie) => (
            <div
              key={movie.id}
              onClick={() => setSelectedMovie(movie)}
              className="cursor-pointer"
            >
              <MovieCard
                movie={{
                  id: movie.id,
                  title: movie.title,
                  genre: movie.genres,
                  year: movie.year,
                  rating: movie.vote_average,
                  poster: movie.poster_path,
                  image: movie.poster_path,
                  banner: movie.backdrop_path,
                  description: movie.overview,
                  language: movie.original_language,
                  popularity: movie.popularity,
                  voteCount: movie.vote_count,
                }}
              />
            </div>
          ))}
        </div>

        {!loading && results.length === 0 && (
          <p className="text-muted-foreground mt-12 text-center">
            No movies found for "{text}". Try another search.
          </p>
        )}
      </main>

      {selectedMovie && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl relative">
            <button
              onClick={() => setSelectedMovie(null)}
              className="absolute top-4 right-4 z-10 bg-black/60 text-white p-2 rounded-full"
            >
              <X size={18} />
            </button>

            <div className="h-72 w-full relative">
              <img
                src={selectedMovie.backdrop_path}
                alt={selectedMovie.title}
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6">
                <h2 className="text-4xl font-bold text-white mb-2">
                  {selectedMovie.title}
                </h2>

                <div className="flex flex-wrap gap-3 text-sm text-white/80">
                  <span>{selectedMovie.genres}</span>
                  <span>{selectedMovie.year}</span>
                  <span>{selectedMovie.original_language}</span>
                  <span className="flex items-center gap-1 text-yellow-400">
                    <Star size={14} fill="currentColor" />
                    {selectedMovie.vote_average}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-2xl font-semibold mb-3">Overview</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedMovie.overview}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-secondary rounded-xl p-4">
                    <p className="text-sm text-muted-foreground">Rating</p>
                    <p className="text-xl font-semibold">
                      {selectedMovie.vote_average}
                    </p>
                  </div>

                  <div className="bg-secondary rounded-xl p-4">
                    <p className="text-sm text-muted-foreground">Votes</p>
                    <p className="text-xl font-semibold">
                      {selectedMovie.vote_count}
                    </p>
                  </div>

                  <div className="bg-secondary rounded-xl p-4">
                    <p className="text-sm text-muted-foreground">Popularity</p>
                    <p className="text-xl font-semibold">
                      {selectedMovie.popularity}
                    </p>
                  </div>

                  <div className="bg-secondary rounded-xl p-4">
                    <p className="text-sm text-muted-foreground">Language</p>
                    <p className="text-xl font-semibold uppercase">
                      {selectedMovie.original_language}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-secondary/40 rounded-2xl p-5 border border-border">
                <h3 className="text-xl font-semibold mb-4">Add Your Review</h3>

                {userId ? (
                  <>
                    <label className="block text-sm mb-2">Rating</label>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="w-full mb-4 px-4 py-3 rounded-lg bg-background border border-border"
                    >
                      <option value={1}>1 Star</option>
                      <option value={2}>2 Stars</option>
                      <option value={3}>3 Stars</option>
                      <option value={4}>4 Stars</option>
                      <option value={5}>5 Stars</option>
                    </select>

                    <label className="block text-sm mb-2">Review</label>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      rows={5}
                      placeholder="Write your review here..."
                      className="w-full px-4 py-3 rounded-lg bg-background border border-border resize-none"
                    />

                    <Button
                      onClick={submitReview}
                      className="w-full mt-4"
                    >
                      Submit Review
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      Login to add rating and review
                    </p>

                    <Button onClick={() => navigate("/login")}>
                      Login Now
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default SearchResults;
