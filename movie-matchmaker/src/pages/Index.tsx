import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Sparkles, Film, Star } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { genres } from "@/data/movies";
import SuggestedMoviesSection from "@/components/SuggestedMoviesSection";

const floatingIcons = [
  { icon: Film, top: "15%", left: "10%", delay: 0 },
  { icon: Star, top: "25%", right: "12%", delay: 0.4 },
  { icon: Sparkles, top: "70%", left: "15%", delay: 0.8 },
  { icon: Film, top: "75%", right: "10%", delay: 1.2 },
];

const Index = () => {
  const [query, setQuery] = useState("");

  const [type, setType] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [year, setYear] = useState("");
  const [network, setNetwork] = useState("");
  const [country, setCountry] = useState("");
  const [rating, setRating] = useState("");

  const navigate = useNavigate();

const handleNormalSearch = () => {
  if (!query.trim()) return;

  navigate(`/search?text=${encodeURIComponent(query.trim())}`);
};

const handleFilterSearch = async () => {
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/users/filter-movi/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: query,
          genre: genreFilter,
          sort: sortBy,
          year: year,
          language: country,
          rating: rating,
          top_n: Math.floor(Math.random() * (42 - 30 + 1)) + 30,
        }),
      }
    );

    const data = await response.json();

console.log("Filtered Movies:", data);

navigate("/search", {
  state: {
    filteredMovies: Array.isArray(data) ? data : data.results || [],
    filters: {
      text: query,
      genre: genreFilter,
      sort: sortBy,
      year: year,
      language: country,
      rating: rating,
    },
  },
});
  } catch (error) {
    console.error("Filter search error:", error);
  }
};

const resetFilters = () => {
  setQuery("");
  setType("");
  setGenreFilter("");
  setSortBy("");
  setYear("");
  setNetwork("");
  setCountry("");
  setRating("");
};

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-hidden relative isolate">
      <Navbar />

      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 80, -50, 0],
            y: [0, -50, 50, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-10 md:top-20 left-0 md:left-10 w-56 md:w-72 h-56 md:h-72 bg-red-500/20 blur-3xl rounded-full"
        />

        <motion.div
          animate={{
            x: [0, -60, 40, 0],
            y: [0, 60, -40, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-10 md:bottom-20 right-0 md:right-10 w-60 md:w-80 h-60 md:h-80 bg-pink-500/20 blur-3xl rounded-full"
        />
      </div>

      {floatingIcons.map((item, index) => {
        const Icon = item.icon;

        return (
          <motion.div
            key={index}
            className="absolute text-primary/20 hidden md:block z-10"
            style={{
              top: item.top,
              left: item.left,
              right: item.right,
            }}
            animate={{
              y: [0, -15, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              delay: item.delay,
              ease: "easeInOut",
            }}
          >
            <Icon className="w-10 h-10" />
          </motion.div>
        );
      })}

      <main
        className="flex-1 flex flex-col items-center justify-center px-6 relative z-10"
        style={{ paddingTop: "var(--nav-height)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl w-full text-center min-h-[calc(100vh-var(--nav-height))] flex flex-col justify-center py-10 md:py-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm mb-6 mx-auto"
          >
            <Sparkles className="w-4 h-4" />
            Unlimited Movie Discovery
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-wide leading-tight"
          >
            Discover Your Next{" "}
            <span className="text-gradient relative inline-block">
              Favorite Movie
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-muted-foreground mt-6 text-base md:text-lg max-w-2xl mx-auto"
          >
            Search by mood, action, thriller, romance, comedy, emotion or anything you want.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-8 md:mt-10 flex items-center gap-2 w-full max-w-2xl mx-auto bg-card/70 backdrop-blur-xl border border-border rounded-2xl px-4 py-3 shadow-xl"
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleNormalSearch()}
              placeholder="Search movies by text..."
              className="flex-1 bg-transparent text-lg md:text-xl text-foreground placeholder:text-muted-foreground/50 outline-none"
            />

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNormalSearch}
              className="bg-primary hover:bg-primary/90 text-primary-foreground p-3 rounded-xl transition-all shadow-lg"
            >
              <Search className="w-5 h-5" />
            </motion.button>
          </motion.div>

       <div className="w-full max-w-7xl mx-auto mt-6 flex flex-wrap gap-3 justify-center">
  <select
    value={genreFilter}
    onChange={(e) => setGenreFilter(e.target.value)}
    className="bg-card border border-border rounded-xl px-5 py-3 min-w-[170px] text-foreground"
  >
    <option value="">Genre</option>
    <option value="Action">Action</option>
    <option value="Adventure">Adventure</option>
    <option value="Animation">Animation</option>
    <option value="Comedy">Comedy</option>
    <option value="Crime">Crime</option>
    <option value="Drama">Drama</option>
    <option value="Family">Family</option>
    <option value="Fantasy">Fantasy</option>
    <option value="History">History</option>
    <option value="Horror">Horror</option>
    <option value="Mystery">Mystery</option>
    <option value="Romance">Romance</option>
    <option value="Science Fiction">Science Fiction</option>
    <option value="Thriller">Thriller</option>
    <option value="War">War</option>
    <option value="Western">Western</option>
  </select>

  <select
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
    className="bg-card border border-border rounded-xl px-5 py-3 min-w-[170px] text-foreground"
  >
    <option value="">Sort By</option>
    <option value="popular">Most Popular</option>
    <option value="rating">Top Rated</option>
    <option value="latest">Latest</option>
    <option value="votes">Most Voted</option>
  </select>

  <select
    value={year}
    onChange={(e) => setYear(e.target.value)}
    className="bg-card border border-border rounded-xl px-5 py-3 min-w-[170px] text-foreground"
  >
    <option value="">Year</option>
    <option value="2026">2026</option>
    <option value="2025">2025</option>
    <option value="2024">2024</option>
    <option value="2023">2023</option>
    <option value="2022">2022</option>
    <option value="2021">2021</option>
    <option value="2020">2020</option>
    <option value="2019">2019</option>
    <option value="2018">2018</option>
    <option value="2017">2017</option>
    <option value="2016">2016</option>
    <option value="2015">2015</option>
    <option value="2014">2014</option>
    <option value="2013">2013</option>
    <option value="2012">2012</option>
    <option value="2011">2011</option>
    <option value="2010">2010</option>
    <option value="2009">2009</option>
    <option value="2008">2008</option>
    <option value="2007">2007</option>
    <option value="2006">2006</option>
    <option value="2005">2005</option>
    <option value="2004">2004</option>
    <option value="2003">2003</option>
    <option value="2002">2002</option>
    <option value="2001">2001</option>
    <option value="2000">2000</option>
  </select>

  <select
    value={country}
    onChange={(e) => setCountry(e.target.value)}
    className="bg-card border border-border rounded-xl px-5 py-3 min-w-[170px] text-foreground"
  >
    <option value="">Language</option>
    <option value="en">English</option>
    <option value="hi">Hindi</option>
    <option value="te">Telugu</option>
    <option value="ta">Tamil</option>
    <option value="ml">Malayalam</option>
    <option value="kn">Kannada</option>
    <option value="mr">Marathi</option>
    <option value="bn">Bengali</option>
    <option value="pa">Punjabi</option>
  </select>

  <select
    value={rating}
    onChange={(e) => setRating(e.target.value)}
    className="bg-card border border-border rounded-xl px-5 py-3 min-w-[170px] text-foreground"
  >
    <option value="">Ratings</option>
    <option value="9">9+</option>
    <option value="8">8+</option>
    <option value="7">7+</option>
    <option value="6">6+</option>
    <option value="5">5+</option>
  </select>

  <button
    onClick={handleFilterSearch}
    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6 py-3 font-medium transition-all flex items-center gap-2"
  >
    <Search className="w-4 h-4" />
    Search Filters
  </button>

  <button
    onClick={resetFilters}
    className="bg-red-500 hover:bg-red-600 text-white rounded-xl px-6 py-3 font-medium transition-all"
  >
    Reset
  </button>
</div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="flex flex-wrap justify-center gap-3 mt-6 md:mt-8 max-w-4xl mx-auto"
          >
            {genres.map((g, index) => (
              <motion.button
                key={g}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/search?text=${encodeURIComponent(g)}`)}
                className="text-xs px-4 py-2 rounded-full border border-border bg-card/60 backdrop-blur-md text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/10 transition-all"
              >
                {g}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      </main>

      <SuggestedMoviesSection isLoggedIn={true} />

      <Footer />
    </div>
  );
};

export default Index;