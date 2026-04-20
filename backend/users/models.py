from django.db import models
import uuid

class Users(models.Model):
    uid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)

    def __str__(self):
        return self.name
    

from django.core.validators import MinValueValidator, MaxValueValidator

class MovieReview(models.Model):
    user = models.ForeignKey(
        Users,
        on_delete=models.CASCADE,
        related_name='movie_reviews'
    )
    movie_name = models.CharField(max_length=200)
    review = models.IntegerField(
        validators=[
            MinValueValidator(0),
            MaxValueValidator(5)
        ]
    )
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.movie_name} - {self.user.name}"


class GenreSearchHistory(models.Model):
    user = models.ForeignKey(
        Users,
        on_delete=models.CASCADE,
        related_name='genre_search_history'
    )
    genre_name = models.CharField(max_length=100)
    searched_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.name} - {self.genre_name}"
    
class MovieRating(models.Model):
    rating_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    movie_id = models.CharField(max_length=100)
    movie_name = models.CharField(max_length=255)
    rating = models.IntegerField()
    review = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.name} - {self.movie_name}"
    

class GenreStatistic(models.Model):
    genre_id = models.IntegerField(unique=True)
    genre_name = models.CharField(max_length=100)

    total_movies = models.IntegerField(default=0)
    avg_popularity = models.FloatField(default=0.0)
    avg_vote_average = models.FloatField(default=0.0)
    total_vote_count = models.IntegerField(default=0)

    highest_popularity = models.FloatField(default=0.0)
    lowest_popularity = models.FloatField(default=0.0)

    latest_release_date = models.DateField(null=True, blank=True)
    oldest_release_date = models.DateField(null=True, blank=True)

    most_common_language = models.CharField(max_length=20, blank=True, null=True)
    most_common_country = models.CharField(max_length=20, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.genre_name} ({self.genre_id})"
