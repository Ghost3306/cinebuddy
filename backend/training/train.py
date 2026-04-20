import os
import pandas as pd
import ast
import pickle

from sentence_transformers import SentenceTransformer

# ==============================
# PATH CONFIG
# ==============================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATASET_PATH = os.path.join(BASE_DIR, "movies1995-26.csv")
MODELS_DIR = os.path.join(BASE_DIR, "models")

# Create models folder if not exists
os.makedirs(MODELS_DIR, exist_ok=True)

# ==============================
# LOAD DATA
# ==============================
print("Loading dataset...")
df = pd.read_csv(DATASET_PATH)

# ==============================
# FIX COLUMN NAMES
# ==============================
df = df.rename(columns={
    "poster_url": "poster_path",
    "banner_url": "backdrop_path"
})

# Drop empty rows
df = df.dropna(how="all")

# ==============================
# CLEAN GENRE IDS
# ==============================
def clean_genres(x):
    try:
        if pd.isna(x):
            return []

        if isinstance(x, list):
            return x

        if isinstance(x, str):
            x = x.strip()

            if x.startswith("[") and x.endswith("]"):
                return ast.literal_eval(x)

            return [
                int(i.strip())
                for i in x.split(",")
                if i.strip().isdigit()
            ]

        if isinstance(x, int):
            return [x]

        return []

    except:
        return []

df["genre_ids"] = df["genre_ids"].apply(clean_genres)

# Remove rows without genres
df = df[df["genre_ids"].apply(lambda x: len(x) > 0)]

# ==============================
# CLEAN TEXT FIELDS
# ==============================
df["title"] = df["title"].fillna("").astype(str)
df["overview"] = df["overview"].fillna("").astype(str)
df["release_date"] = df["release_date"].fillna("").astype(str).str.strip()
df["original_language"] = df["original_language"].fillna("").astype(str)
df["poster_path"] = df["poster_path"].fillna("").astype(str)
df["backdrop_path"] = df["backdrop_path"].fillna("").astype(str)

# Keep rows with valid overview
df = df[df["overview"].str.len() > 20]

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
    37: "Western"
}

# ==============================
# CONVERT GENRES TO TEXT
# ==============================
def convert_genres(ids):
    return " ".join([
        genre_map.get(i, "")
        for i in ids
    ])

df["genres"] = df["genre_ids"].apply(convert_genres)

# ==============================
# CLEAN NUMERIC FIELDS
# ==============================
df["vote_average"] = pd.to_numeric(df["vote_average"], errors="coerce").fillna(0)
df["popularity"] = pd.to_numeric(df["popularity"], errors="coerce").fillna(0)
df["vote_count"] = pd.to_numeric(df["vote_count"], errors="coerce").fillna(0)

# ==============================
# PREPROCESS YEAR
# ==============================
df["year"] = pd.to_datetime(
    df["release_date"],
    format="%Y-%m-%d",
    errors="coerce"
).dt.year

# Remove invalid year rows
df = df[df["year"].notnull()]

# ==============================
# COMBINE FEATURES
# ==============================
df["combined"] = (
    df["title"] + " " +
    df["overview"] + " " +
    df["genres"] + " " +
    df["original_language"] + " " +
    df["release_date"]
)

df["combined"] = (
    df["combined"]
    .str.replace(r"\s+", " ", regex=True)
    .str.strip()
)

# ==============================
# LOAD MODEL
# ==============================
print("Loading Sentence Transformer model...")
model = SentenceTransformer("all-MiniLM-L6-v2")

print(f"Total movies used for training: {len(df)}")
print("Generating embeddings...")

# ==============================
# GENERATE EMBEDDINGS
# ==============================
embeddings = model.encode(
    df["combined"].tolist(),
    show_progress_bar=True,
    batch_size=64
)

# ==============================
# SAVE FILES INSIDE models/
# ==============================
print("Saving model files...")

pickle.dump(
    embeddings,
    open(os.path.join(MODELS_DIR, "embeddings.pkl"), "wb")
)

pickle.dump(
    df,
    open(os.path.join(MODELS_DIR, "movies.pkl"), "wb")
)

pickle.dump(
    model,
    open(os.path.join(MODELS_DIR, "bert_model.pkl"), "wb")
)

print("Training complete successfully")
print(f"Saved {len(df)} movies")
print(f"Files saved inside: {MODELS_DIR}")