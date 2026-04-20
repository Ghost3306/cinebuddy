import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { RadioBrowserApi } from "radio-browser-api";
import { motion } from "framer-motion";
import { Play, Pause, Radio as RadioIcon } from "lucide-react";

const api = new RadioBrowserApi("CineBuddy Radio App");

const RadioPage = () => {
  const [stations, setStations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStation, setCurrentStation] = useState<any>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const result = await api.searchStations({
          language: "english",
          tag: "bollywood",
          limit: 12,
        });

        setStations(result);
      } catch (error) {
        console.error("Radio fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();

    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, []);

  const playStation = (station: any) => {
    if (currentStation?.id === station.id && audio) {
      audio.pause();
      audio.currentTime = 0;
      setAudio(null);
      setCurrentStation(null);
      return;
    }

    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    const newAudio = new Audio(station.urlResolved);
    newAudio.play();

    setAudio(newAudio);
    setCurrentStation(station);
  };

  const stopStation = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    setAudio(null);
    setCurrentStation(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main
        className="flex-1 px-6 md:px-10 py-10"
        style={{ marginTop: "var(--nav-height)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-6xl font-display mb-4">
              Live Radio Stations
            </h1>

            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Listen to Bollywood, English, Jazz and other live radio stations
              while browsing movies.
            </p>
          </div>

          {loading ? (
            <div className="text-center text-muted-foreground py-20">
              Loading radio stations...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stations.map((station, index) => (
                <motion.div
                  key={station.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className={`bg-card border rounded-3xl p-6 shadow-xl transition-all duration-300 ${
                    currentStation?.id === station.id
                      ? "border-primary shadow-primary/20"
                      : "border-border"
                  }`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    {station.favicon ? (
                      <img
                        src={station.favicon}
                        alt={station.name}
                        className="w-14 h-14 rounded-full object-cover border border-border"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                        <RadioIcon size={24} />
                      </div>
                    )}

                    <div className="min-w-0">
                      <h3 className="font-semibold text-lg line-clamp-1">
                        {station.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {station.country}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground mb-5">
                    <p>
                      <span className="font-medium text-foreground">
                        Language:
                      </span>{" "}
                      {Array.isArray(station.language)
                        ? station.language.join(", ")
                        : station.language}
                    </p>

                    <p>
                      <span className="font-medium text-foreground">
                        Tags:
                      </span>{" "}
                      {Array.isArray(station.tags)
                        ? station.tags.slice(0, 3).join(", ")
                        : station.tags}
                    </p>

                    <p>
                      <span className="font-medium text-foreground">
                        Votes:
                      </span>{" "}
                      {station.votes}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    {currentStation?.id === station.id ? (
                      <button
                        onClick={stopStation}
                        className="w-full bg-red-500 hover:bg-red-600 text-white rounded-xl py-3 flex items-center justify-center gap-2 transition-all"
                      >
                        <Pause size={18} />
                        Pause Radio
                      </button>
                    ) : (
                      <button
                        onClick={() => playStation(station)}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-3 flex items-center justify-center gap-2 transition-all"
                      >
                        <Play size={18} />
                        Play Radio
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RadioPage;