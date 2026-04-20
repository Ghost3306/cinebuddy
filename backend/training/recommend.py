import os
import pickle
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

# ==============================
# PATH CONFIG
# ==============================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")

# ==============================
# LOAD FILES
# ==============================
print("Loading model files...")

df = pickle.load(open(os.path.join(MODELS_DIR, "movies.pkl"), "rb"))
embeddings = pickle.load(open(os.path.join(MODELS_DIR, "embeddings.pkl"), "rb"))
model = pickle.load(open(os.path.join(MODELS_DIR, "bert_model.pkl"), "rb"))

# ==============================
# PREPROCESS YEAR
# ==============================
df["release_date"] = df["release_date"].astype(str).str.strip()

df["year"] = pd.to_datetime(
    df["release_date"],
    format="%Y-%m-%d",
    errors="coerce"
).dt.year

df = df[df["year"].notnull()]
df["year"] = df["year"].astype(int)

# ==============================
# GENRE MAP
# ==============================
genre_map = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western",
    10759: "Action & Adventure",
    10762: "Kids",
    10763: "News",
    10764: "Reality",
    10765: "Sci-Fi & Fantasy",
    10766: "Soap",
    10767: "Talk",
    10768: "War & Politics"
}

genre_name_to_id = {
    v.lower(): k
    for k, v in genre_map.items()
}

# ==============================
# RECOMMEND FUNCTION
# ==============================
def recommend_from_text(
    user_input,
    genre=None,
    start_year=None,
    end_year=None,
    top_n=5
):
    # Encode input
    user_embedding = model.encode([user_input])

    # Similarity score
    sim_scores = cosine_similarity(
        user_embedding,
        embeddings
    )[0]

    df_temp = df.copy()
    df_temp["score"] = sim_scores

    # ==============================
    # GENRE FILTER
    # ==============================
    if genre:
        genre = genre.lower().strip()

        df_temp = df_temp[
            df_temp["genres"]
            .astype(str)
            .str.lower()
            .str.contains(genre, na=False)
        ]

    # ==============================
    # YEAR FILTER
    # ==============================
    if start_year is not None and end_year is not None:
        start_year = int(start_year)
        end_year = int(end_year)

        df_temp = df_temp[
            (df_temp["year"] >= start_year) &
            (df_temp["year"] <= end_year)
        ]

    # ==============================
    # SORT RESULTS
    # ==============================
    df_temp = df_temp.sort_values(
        by="score",
        ascending=False
    )

    return df_temp[
        [
            "id",
            "title",
            "overview",
            "release_date",
            "year",
            "genres",
            "vote_average",
            "vote_count",
            "popularity",
            "original_language",
            "poster_path",
            "backdrop_path",
            "score"
        ]
    ].head(top_n)

# ==============================
# CLI
# ==============================
if __name__ == "__main__":
    print("\nMovie Recommendation System\n")

    print("Available Genres:")
    print(", ".join(sorted(set(genre_name_to_id.keys()))))

    while True:
        text = input("\nEnter description (or 'exit'): ").strip()

        if text.lower() == "exit":
            break

        genre_input = input(
            "Enter genre (or press Enter to skip): "
        ).strip()

        if genre_input == "":
            genre_input = None

        use_year = input(
            "Do you want year filter? (y/n): "
        ).strip().lower()

        start_year = None
        end_year = None

        if use_year == "y":
            start_year = int(input("Enter start year: "))
            end_year = int(input("Enter end year: "))

        top_n = input("How many recommendations? (default 5): ").strip()

        if top_n == "":
            top_n = 5
        else:
            top_n = int(top_n)

        result = recommend_from_text(
            user_input=text,
            genre=genre_input,
            start_year=start_year,
            end_year=end_year,
            top_n=top_n
        )

        print("\nRecommendations:\n")

        if len(result) == 0:
            print("No movies found")
        else:
            print(result.to_string(index=False))