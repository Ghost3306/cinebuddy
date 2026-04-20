from django.contrib import admin
from .models import Users,MovieReview,GenreSearchHistory,GenreStatistic

@admin.register(Users)
class UsersAdmin(admin.ModelAdmin):
    list_display = ['uid', 'name', 'email']
    search_fields = ['name', 'email']

@admin.register(GenreStatistic)
class GenreStatisticAdmin(admin.ModelAdmin):
    list_display = [
        'genre_id',
        'genre_name',
        'total_movies',
        'avg_popularity',
        'avg_vote_average',
        'total_vote_count',
        'most_common_language',
        'most_common_country',
    ]

@admin.register(MovieReview)
class MovieReviewAdmin(admin.ModelAdmin):
    list_display = ['id', 'movie_name', 'review', 'user', 'created_at']
@admin.register(GenreSearchHistory)
class GenreSearchHistoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'genre_name', 'searched_at']


from .models import MovieRating
admin.site.register(MovieRating)
