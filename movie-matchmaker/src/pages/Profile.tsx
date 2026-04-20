import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Review {
  review_id: number;
  movie_id: string;
  movie_name: string;
  rating: number;
  review: string;
  created_at: string;
}

interface GenreHistory {
  genre_id: number;
  genre_name: string;
  searched_at: string;
}

const Profile = () => {
  const [userData, setUserData] = useState<any>(null);

  const userId = localStorage.getItem("user_uuid");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/users/user-data/${userId}/`
        );

        const data = await response.json();

        if (data.status === "success") {
          setUserData(data);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main
        className="flex-1 px-6 md:px-10 py-10"
        style={{ paddingTop: "calc(var(--nav-height) + 30px)" }}
      >
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h1 className="text-3xl font-bold">Profile Dashboard</h1>

            {userData ? (
              <div className="mt-4 space-y-2">
                <p>
                  <span className="font-semibold">Name:</span> {userData.name}
                </p>

                <p>
                  <span className="font-semibold">Email:</span> {userData.email}
                </p>

                {/* <p>
                  <span className="font-semibold">User UUID:</span>{" "}
                  {userData.user_id}
                </p> */}
              </div>
            ) : (
              <p className="text-muted-foreground">Loading user data...</p>
            )}
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-4">Movie Reviews</h2>

            <div className="grid gap-4">
              {userData?.reviews?.length > 0 ? (
                userData.reviews.map((review: Review) => (
                  <div
                    key={review.review_id}
                    className="border border-border rounded-xl p-4 bg-secondary/30"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h3 className="text-xl font-semibold">
                        {review.movie_name}
                      </h3>

                      <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm">
                        {review.rating}/5
                      </span>
                    </div>

                    <p className="mt-3 text-muted-foreground">
                      {review.review}
                    </p>

                    <p className="text-xs text-muted-foreground mt-3">
                      Movie ID: {review.movie_id}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Added On:{" "}
                      {new Date(review.created_at).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">
                  No reviews added yet.
                </p>
              )}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-4">
              Genre Search History
            </h2>

            <div className="flex flex-wrap gap-3">
              {userData?.genre_history?.length > 0 ? (
                userData.genre_history.map((genre: GenreHistory) => (
                  <div
                    key={genre.genre_id}
                    className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm"
                  >
                    {genre.genre_name}
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">
                  No genre history found.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;