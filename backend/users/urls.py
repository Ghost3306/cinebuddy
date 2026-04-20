# users/urls.py

from django.urls import path
from .views import register_user, login_user,add_movie_review,delete_movie_review,add_genre_search_history,get_user_data,forgot_password_page,send_email_to_user,recommend_movies

from users import views

urlpatterns = [
    path('register/', register_user, name='register_user'),
    path('login/', login_user, name='login_user'),
    path('add-review/', add_movie_review, name='add_movie_review'),
    path('delete-review/<int:review_id>/', delete_movie_review, name='delete_movie_review'),
    path('add-genre-history/', add_genre_search_history, name='add_genre_search_history'),
    path('user-data/<uuid:user_id>/', get_user_data, name='get_user_data'),
    path('forgot-password/<uuid:user_id>/',forgot_password_page, name='forgot_password_page'),
    path('send-email/', send_email_to_user, name='send_email_to_user'),
    path('recommend-movies/',recommend_movies,name='recommend_movies'),
    path('add-movie-rating/', views.add_movie_rating, name='add_movie_rating'),
    path('filter-movi/', views.filter_movies, name='filter_movies'),
]