
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const collections = [
  {
    title: "Marvel Collection",
    image:
      "https://image.tmdb.org/t/p/original/9BBTo63ANSmhC4e6r62OJFuK2GL.jpg",
    search: "Marvel Superhero Movies",
  },
  {
    title: "Harry Potter Collection",
    image:
      "https://image.tmdb.org/t/p/original/n5A7brJCjejceZmHyujwUTVgQNC.jpg",
    search: "Harry Potter",
  },
  {
    title: "Fast & Furious Collection",
    image:
      "https://image.tmdb.org/t/p/original/4qCqAdHcNKeAHcK8tJ8wNJZa9cx.jpg",
    search: "Fast Furious",
  },
  {
    title: "DC Collection",
    image:
      "https://image.tmdb.org/t/p/original/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg",
    search: "DC Movies",
  },
  
  {
    title: "Top Sci-Fi Movies",
    image:
      "https://image.tmdb.org/t/p/original/8I37NtDffNV7AZlDa7uDvvqhovU.jpg",
    search: "Science Fiction Movies",
  },
];

const Collections = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main
        className="flex-1 px-6 md:px-10 py-10"
        style={{ marginTop: "var(--nav-height)" }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-display mb-4">
              Top Movie Collections
            </h1>

            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Explore the most popular movie universes, franchises and themed collections.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((collection, index) => (
              <motion.div
                key={collection.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() =>
                  navigate(
                    `/search?text=${encodeURIComponent(collection.search)}`
                  )
                }
                className="group cursor-pointer overflow-hidden rounded-3xl border border-border bg-card shadow-xl"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={collection.image}
                    alt={collection.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h2 className="text-white text-2xl font-bold mb-2">
                      {collection.title}
                    </h2>

                    <p className="text-white/70 text-sm">
                      Click to explore movies
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Collections;
