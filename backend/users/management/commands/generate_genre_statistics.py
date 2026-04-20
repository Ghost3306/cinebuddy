import csv
from collections import defaultdict, Counter
from datetime import datetime

from django.core.management.base import BaseCommand

from users.models import GenreStatistic



GENRE_MAP = {
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


class Command(BaseCommand):
    help = "Generate genre statistics from movie CSV file"

    def handle(self, *args, **kwargs):
        csv_file_path = "training\\movies1995-26.csv"  # Change to your CSV path

        genre_data = defaultdict(lambda: {
            "movie_count": 0,
            "total_popularity": 0,
            "total_vote_average": 0,
            "total_vote_count": 0,
            "highest_popularity": 0,
            "lowest_popularity": None,
            "release_dates": [],
            "languages": [],
            "countries": []
        })

        with open(csv_file_path, mode="r", encoding="utf-8") as file:
            reader = csv.DictReader(file)

            for row in reader:
                genre_ids = [
                    genre.strip()
                    for genre in row["genre_ids"].split(",")
                    if genre.strip()
                ]
                popularity = float(row["popularity"])
                vote_average = float(row["vote_average"])
                vote_count = int(row["vote_count"])
                language = row["original_language"]
                country = row["origin_country"]

                release_date = None
                if row["release_date"]:
                    release_date = datetime.strptime(
                        row["release_date"],
                        "%Y-%m-%d"
                    ).date()

                for genre_id_str in genre_ids:
                    genre_id = int(genre_id_str.strip())

                    genre_data[genre_id]["movie_count"] += 1
                    genre_data[genre_id]["total_popularity"] += popularity
                    genre_data[genre_id]["total_vote_average"] += vote_average
                    genre_data[genre_id]["total_vote_count"] += vote_count
                    genre_data[genre_id]["languages"].append(language)
                    genre_data[genre_id]["countries"].append(country)

                    if popularity > genre_data[genre_id]["highest_popularity"]:
                        genre_data[genre_id]["highest_popularity"] = popularity

                    if (
                        genre_data[genre_id]["lowest_popularity"] is None
                        or popularity < genre_data[genre_id]["lowest_popularity"]
                    ):
                        genre_data[genre_id]["lowest_popularity"] = popularity

                    if release_date:
                        genre_data[genre_id]["release_dates"].append(release_date)

        GenreStatistic.objects.all().delete()

        for genre_id, data in genre_data.items():
            total_movies = data["movie_count"]

            avg_popularity = (
                data["total_popularity"] / total_movies
                if total_movies > 0 else 0
            )

            avg_vote_average = (
                data["total_vote_average"] / total_movies
                if total_movies > 0 else 0
            )

            most_common_language = None
            if data["languages"]:
                most_common_language = Counter(data["languages"]).most_common(1)[0][0]

            most_common_country = None
            if data["countries"]:
                most_common_country = Counter(data["countries"]).most_common(1)[0][0]

            latest_release_date = None
            oldest_release_date = None

            if data["release_dates"]:
                latest_release_date = max(data["release_dates"])
                oldest_release_date = min(data["release_dates"])

            GenreStatistic.objects.create(
                genre_id=genre_id,
                genre_name=GENRE_MAP.get(genre_id, f"Unknown Genre {genre_id}"),
                total_movies=total_movies,
                avg_popularity=round(avg_popularity, 2),
                avg_vote_average=round(avg_vote_average, 2),
                total_vote_count=data["total_vote_count"],
                highest_popularity=data["highest_popularity"],
                lowest_popularity=data["lowest_popularity"],
                latest_release_date=latest_release_date,
                oldest_release_date=oldest_release_date,
                most_common_language=most_common_language,
                most_common_country=most_common_country,
            )

        self.stdout.write(
            self.style.SUCCESS("Genre statistics generated successfully")
        )