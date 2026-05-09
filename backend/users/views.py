import json
from django.http import JsonResponse,HttpResponse
from .models import Users,MovieReview,GenreSearchHistory
from django.views.decorators.csrf import csrf_exempt


from .models import ApiTracking

def track_api(
    request,
    api_name,
    request_data=None,
    response_status="success",
    user=None
):

    ip = request.META.get('REMOTE_ADDR')

    ApiTracking.objects.create(
        api_name=api_name,
        user=user,
        request_method=request.method,
        request_data=str(request_data),
        response_status=response_status,
        ip_address=ip
    )



@csrf_exempt
def register_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            name = data.get('name')
            email = data.get('email')
            password = data.get('password')

            if not name or not email or not password:
                return JsonResponse({
                    'status': 'error',
                    'message': 'All fields are required'
                })

            if Users.objects.filter(email=email).exists():
                return JsonResponse({
                    'status': 'error',
                    'message': 'Email already exists'
                })

            user = Users.objects.create(
                name=name,
                email=email,
                password=password
            )
            track_api(
                request=request,
                api_name="register_user",
                request_data=data,
                response_status="success",
                user=user
            )
            return JsonResponse({
                'status': 'success',
                'message': 'User registered successfully',
                'user_id': str(user.uid)
            })
        
        except Exception as e:
            track_api(
                request=request,
                api_name="register_user",
                request_data=data if 'data' in locals() else None,
                response_status=f"failed: {str(e)}"
            )
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            })

    return JsonResponse({
        'status': 'error',
        'message': 'Only POST method allowed'
    })
@csrf_exempt
def login_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            email = data.get('email')
            password = data.get('password')

            if not email or not password:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Email and password are required'
                })

            user = Users.objects.filter(
                email=email,
                password=password
            ).first()

            if user is None:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Invalid email or password'
                })
            track_api(
                request=request,
                api_name="login_user",
                request_data=data,
                response_status="success",
                user=user
            )
            return JsonResponse({
                'uuid':user.uid,
                'name':user.name,
                'status': 'success',
                'message': 'Login successful'
            })

        except Exception as e:
            track_api(
                request=request,
                api_name="login_user",
                request_data=data if 'data' in locals() else None,
                response_status=f"failed: {str(e)}"
            )
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            })

    return JsonResponse({
        'status': 'error',
        'message': 'Only POST method allowed'
    })


# users/views.py

@csrf_exempt
def add_movie_review(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            user_id = data.get('user_id')
            movie_name = data.get('movie_name')
            review = data.get('review')
            description = data.get('description')

            if not user_id or not movie_name or review is None or not description:
                return JsonResponse({
                    'status': 'error',
                    'message': 'All fields are required'
                })

            user = Users.objects.filter(uid=user_id).first()

            if user is None:
                return JsonResponse({
                    'status': 'error',
                    'message': 'User not found'
                })

            if int(review) < 0 or int(review) > 5:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Review must be between 0 and 5'
                })

            movie_review = MovieReview.objects.create(
                user=user,
                movie_name=movie_name,
                review=review,
                description=description
            )

            track_api(
                request=request,
                api_name="add_movie_review",
                request_data=data,
                response_status="success",
                user=user
            )
            return JsonResponse({
                'status': 'success',
                'message': 'Movie review added successfully',
                'review_id': movie_review.id
            })

        except Exception as e:
            track_api(
                request=request,
                api_name="add_movie_review",
                request_data=data if 'data' in locals() else None,
                response_status=f"failed: {str(e)}"
            )
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            })

    return JsonResponse({
        'status': 'error',
        'message': 'Only POST method allowed'
    })


# users/views.py

@csrf_exempt
def delete_movie_review(request, review_id):
    if request.method == 'DELETE':
        try:
            movie_review = MovieReview.objects.filter(id=review_id).first()

            if movie_review is None:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Review not found'
                })

            movie_review.delete()
            track_api(
                request=request,
                api_name="delete_movie_review",
                request_data={
                    "review_id": review_id
                },
                response_status="success",
                user=movie_review.user
            )
            return JsonResponse({
                'status': 'success',
                'message': 'Review deleted successfully'
            })
            


        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            })

    return JsonResponse({
        'status': 'error',
        'message': 'Only DELETE method allowed'
    })



# users/views.py

@csrf_exempt
def add_genre_search_history(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            user_id = data.get('user_id')
            genre_name = data.get('genre_name')

            if not user_id or not genre_name:
                return JsonResponse({
                    'status': 'error',
                    'message': 'User ID and genre name are required'
                })

            user = Users.objects.filter(uid=user_id).first()

            if user is None:
                return JsonResponse({
                    'status': 'error',
                    'message': 'User not found'
                })

            genre_history = GenreSearchHistory.objects.create(
                user=user,
                genre_name=genre_name
            )
            track_api(
                request=request,
                api_name="add_genre_search_history",
                request_data=data,
                response_status="success",
                user=user
            )


            return JsonResponse({
                'status': 'success',
                'message': 'Genre search history added successfully',
                'history_id': genre_history.id
            })

        except Exception as e:
            track_api(
                request=request,
                api_name="add_genre_search_history",
                request_data=data if 'data' in locals() else None,
                response_status=f"failed: {str(e)}"
            )
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            })

    return JsonResponse({
        'status': 'error',
        'message': 'Only POST method allowed'
    })

# users/views.py
@csrf_exempt
def get_user_data(request, user_id):
    if request.method == 'GET':
        try:
            user = Users.objects.filter(uid=user_id).first()

            if user is None:
                return JsonResponse({
                    'status': 'error',
                    'message': 'User not found'
                })

            reviews = MovieRating.objects.filter(user=user)
            genre_history = GenreSearchHistory.objects.filter(user=user)

            review_data = []
            for review in reviews:
                review_data.append({
                    'review_id': review.rating_id,
                    'movie_id': review.movie_id,
                    'movie_name': review.movie_name,
                    'rating': review.rating,
                    'review': review.review,
                    'created_at': review.created_at
                })

            genre_data = []
            for genre in genre_history:
                genre_data.append({
                    'genre_id': genre.id,
                    'genre_name': genre.genre_name,
                    'searched_at': genre.searched_at
                })
            track_api(
                request=request,
                api_name="get_user_data",
                request_data={
                    "user_id": user_id
                },
                response_status="success",
                user=user
            )
            return JsonResponse({
                'status': 'success',
                'user_id': str(user.uid),
                'name': user.name,
                'email': user.email,
                'reviews': review_data,
                'genre_history': genre_data
            })

        except Exception as e:
            track_api(
                request=request,
                api_name="get_user_data",
                request_data=data if 'data' in locals() else None,
                response_status=f"failed: {str(e)}"
            )
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            })

    return JsonResponse({
        'status': 'error',
        'message': 'Only GET method allowed'
    })

# users/views.py

from django.shortcuts import render, redirect
from django.http import HttpResponse
from .models import Users

@csrf_exempt
def forgot_password_page(request, user_id):
    user = Users.objects.filter(uid=user_id).first()

    if user is None:
        return HttpResponse("User not found")

    if request.method == 'POST':
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')

        if not password or not confirm_password:
            return HttpResponse("Both password fields are required")

        if password != confirm_password:
            return HttpResponse("Passwords do not match")

        user.password = password
        user.save()

        return HttpResponse("""
        <html>
            <head>
                <title>Password Changed</title>
            </head>
            <body style="font-family: Arial; background-color: #f4f4f4; padding: 40px;">
                <div style="max-width: 500px; margin: auto; background: white; padding: 30px; border-radius: 12px; text-align: center;">
                    <h2>Password Changed Successfully</h2>
                    <p>You can now login with your new password.</p>
                </div>
            </body>
        </html>
        """)

    return HttpResponse(f"""
    <html>
        <head>
            <title>Forgot Password</title>
        </head>
        <body style="font-family: Arial; background-color: #f4f4f4; padding: 40px;">
            <div style="max-width: 500px; margin: auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);">
                
                <h2 style="text-align: center; color: #333;">Reset Password</h2>
                
                <p style="font-size: 16px; color: #555;">
                    Hello <strong>{user.name}</strong>
                </p>

                <form method="POST">
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Enter New Password"
                        style="width: 100%; padding: 12px; margin-top: 15px; border: 1px solid #ccc; border-radius: 8px;"
                        required
                    >

                    <input 
                        type="password" 
                        name="confirm_password" 
                        placeholder="Confirm Password"
                        style="width: 100%; padding: 12px; margin-top: 15px; border: 1px solid #ccc; border-radius: 8px;"
                        required
                    >

                    <button 
                        type="submit"
                        style="width: 100%; background-color: #4CAF50; color: white; padding: 12px; margin-top: 20px; border: none; border-radius: 8px; font-size: 16px; cursor: pointer;"
                    >
                        Change Password
                    </button>
                </form>
            </div>
        </body>
    </html>
    """)



# users/views.py

import json
import resend
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

resend.api_key = "re_gBLa4ucu_BmgmjSxjrgpWFKi2Mf82Uek2"

@csrf_exempt
def send_email_to_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            email = data.get('email')
            subject = data.get('subject')
            message = data.get('message')

            if not email or not subject or not message:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Email, subject and message are required'
                })

            response = resend.Emails.send({
                "from": "onboarding@resend.dev",
                "to": email,
                "subject": subject,
                "html": f"""
                <div style="font-family: Arial; padding: 20px;">
                    <h2>{subject}</h2>
                    <p>{message}</p>
                </div>
                """
            })

            return JsonResponse({
                'status': 'success',
                'message': 'Email sent successfully',
                'response': response
            })

        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            })

    return JsonResponse({
        'status': 'error',
        'message': 'Only POST method allowed'
    })


import os
import json
import pickle
import pandas as pd

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from sklearn.metrics.pairwise import cosine_similarity

# ==============================
# PATH CONFIG
# ==============================
import os
import pickle
import sys
import sentence_transformers.SentenceTransformer

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "training", "models")

# Fix old pickle module path
sys.modules['sentence_transformers.sentence_transformer'] = sentence_transformers.SentenceTransformer

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
# RECOMMEND MOVIES API
# ==============================
import random
@csrf_exempt
@csrf_exempt
def recommend_movies(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            user_input = data.get("text")
            genre = data.get("genre")
            start_year = data.get("start_year")
            end_year = data.get("end_year")
            top_n = data.get("top_n_", 50)
            user_id = data.get("user_id")

            if not user_input:
                return JsonResponse({
                    "status": "error",
                    "message": "text field is required"
                })

            print("user_id =", user_id)
            print("genre =", genre)
            print("text =", user_input)

            # ==============================
            # SAVE GENRE SEARCH HISTORY
            # ==============================
            if user_id:
                print(1)
                try:
                    user = Users.objects.get(uid=user_id)
                    print(2)
                    history = GenreSearchHistory(
                        user=user,
                        genre_name=user_input
                    )

                    print(3)

                    history.save()
                    print("Genre search history saved")

                except Users.DoesNotExist:
                    print(4)
                    print(f"User not found: {user_id}")

                except Exception as history_error:
                    print(5)
                    print(f"Genre history save error: {history_error}")

            # ==============================
            # ENCODE USER INPUT
            # ==============================
            user_embedding = model.encode([user_input])

            # ==============================
            # CALCULATE SIMILARITY
            # ==============================
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
                genre = str(genre).lower().strip()

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
            # CONVERT IMPORTANT COLUMNS
            # ==============================
            df_temp["vote_average"] = pd.to_numeric(
                df_temp["vote_average"],
                errors="coerce"
            ).fillna(0)

            df_temp["vote_count"] = pd.to_numeric(
                df_temp["vote_count"],
                errors="coerce"
            ).fillna(0)

            df_temp["popularity"] = pd.to_numeric(
                df_temp["popularity"],
                errors="coerce"
            ).fillna(0)

            # ==============================
            # REMOVE VERY LOW VOTE MOVIES
            # ==============================
            df_temp = df_temp[
                df_temp["vote_count"] >= 50
            ]

            # If after filtering no movie remains, use all filtered movies
            if df_temp.empty:
                df_temp = df.copy()
                df_temp["score"] = sim_scores

                if genre:
                    df_temp = df_temp[
                        df_temp["genres"]
                        .astype(str)
                        .str.lower()
                        .str.contains(genre, na=False)
                    ]

            # ==============================
            # CALCULATE FINAL SCORE
            # ==============================
            max_popularity = max(df_temp["popularity"].max(), 1)
            max_vote_count = max(df_temp["vote_count"].max(), 1)

            df_temp["final_score"] = (
                (df_temp["score"] * 0.55) +
                ((df_temp["vote_average"] / 10) * 0.20) +
                ((df_temp["popularity"] / max_popularity) * 0.10) +
                ((df_temp["vote_count"] / max_vote_count) * 0.15)
            )

            # ==============================
            # SORT RESULTS
            # ==============================
            df_temp = df_temp.sort_values(
                by=[
                    "final_score",
                    "vote_average",
                    "vote_count",
                    "popularity"
                ],
                ascending=[False, False, False, False]
            )

            # ==============================
            # LIMIT RESULTS
            # ==============================
            df_temp = df_temp.head(top_n)

            # ==============================
            # FORMAT RESPONSE
            # ==============================
            results = []

            for _, row in df_temp.iterrows():
                results.append({
                    "id": int(row["id"]) if pd.notna(row["id"]) else None,
                    "title": row["title"],
                    "overview": row["overview"],
                    "release_date": row["release_date"],
                    "year": int(row["year"]) if pd.notna(row["year"]) else None,
                    "genres": row["genres"],
                    "vote_average": float(row["vote_average"]) if pd.notna(row["vote_average"]) else 0,
                    "vote_count": int(row["vote_count"]) if pd.notna(row["vote_count"]) else 0,
                    "popularity": float(row["popularity"]) if pd.notna(row["popularity"]) else 0,
                    "original_language": row["original_language"],
                    "poster_path": row["poster_path"],
                    "backdrop_path": row["backdrop_path"],
                    "score": round(float(row["score"]), 4),
                    "final_score": round(float(row["final_score"]), 4)
                })
            track_api(
                request=request,
                api_name="recommend_movies",
                request_data=data,
                response_status="success",
                user=user if user_id else None
            )
            return JsonResponse({
                "status": "success",
                "count": len(results),
                "results": results
            })

        except Exception as e:
            track_api(
                request=request,
                api_name="recommend_movies",
                request_data=data if 'data' in locals() else None,
                response_status=f"failed: {str(e)}"
            )
            print("Recommendation error:", str(e))

            return JsonResponse({
                "status": "error",
                "message": str(e)
            })

    return JsonResponse({
        "status": "error",
        "message": "Only POST method allowed"
    })
# views.py

import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Users, MovieRating

@csrf_exempt
def add_movie_rating(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            user_id = data.get("user_id")
            movie_id = data.get("movie_id")
            movie_name = data.get("movie_name")
            rating = data.get("rating")
            review = data.get("review")

            if not user_id or not movie_id or not movie_name or not rating:
                return JsonResponse({
                    "status": "error",
                    "message": "user_id, movie_id, movie_name and rating are required"
                })

            user = Users.objects.filter(uid=user_id).first()

            if not user:
                return JsonResponse({
                    "status": "error",
                    "message": "User not found"
                })

            movie_rating = MovieRating.objects.create(
                user=user,
                movie_id=movie_id,
                movie_name=movie_name,
                rating=rating,
                review=review
            )
            track_api(
                request=request,
                api_name="add_genre_search_history",
                request_data=data,
                response_status="success",
                user=user
            )

            return JsonResponse({
                "status": "success",
                "message": "Movie rating added successfully",
                "rating_id": movie_rating.rating_id
            })

        except Exception as e:
            track_api(
                request=request,
                api_name="add_genre_search_history",
                request_data=data if 'data' in locals() else None,
                response_status=f"failed: {str(e)}"
            )
            return JsonResponse({
                "status": "error",
                "message": str(e)
            })

    return JsonResponse({
        "status": "error",
        "message": "Only POST method allowed"
    })


@csrf_exempt
def filter_movies(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            text = data.get("text", "")
            genre = data.get("genre", "")
            sort_by = data.get("sort", "")
            year = data.get("year", "")
            language = data.get("language", "")
            min_rating = data.get("rating", "")
            top_n = int(data.get("top_n", 20))

            df_temp = df.copy()

            # Text similarity search
            if text:
                user_embedding = model.encode([text])
                sim_scores = cosine_similarity(user_embedding, embeddings)[0]
                df_temp["score"] = sim_scores
            else:
                df_temp["score"] = 0

            # Genre filter
            if genre:
                df_temp = df_temp[
                    df_temp["genres"]
                    .astype(str)
                    .str.lower()
                    .str.contains(genre.lower(), na=False)
                ]

            # Year filter
            if year:
                df_temp = df_temp[
                    df_temp["year"].astype(str) == str(year)
                ]

            # Language filter
            if language:
                df_temp = df_temp[
                    df_temp["original_language"]
                    .astype(str)
                    .str.lower() == language.lower()
                ]

            # Minimum rating filter
            if min_rating:
                df_temp = df_temp[
                    df_temp["vote_average"] >= float(min_rating)
                ]

            # Sorting
            if sort_by == "popular":
                df_temp = df_temp.sort_values(
                    by="popularity",
                    ascending=False
                )

            elif sort_by == "rating":
                df_temp = df_temp.sort_values(
                    by="vote_average",
                    ascending=False
                )

            elif sort_by == "latest":
                df_temp = df_temp.sort_values(
                    by="year",
                    ascending=False
                )

            elif sort_by == "votes":
                df_temp = df_temp.sort_values(
                    by="vote_count",
                    ascending=False
                )

            else:
                df_temp = df_temp.sort_values(
                    by="score",
                    ascending=False
                )

            results = []

            for _, movie in df_temp.head(top_n).iterrows():
                poster_url = ""
                backdrop_url = ""

                if "poster_url" in df_temp.columns and pd.notna(movie.get("poster_url")):
                    poster_url = str(movie.get("poster_url"))

                elif "poster_path" in df_temp.columns and pd.notna(movie.get("poster_path")):
                    poster_url = str(movie.get("poster_path"))

                if "banner_url" in df_temp.columns and pd.notna(movie.get("banner_url")):
                    backdrop_url = str(movie.get("banner_url"))

                elif "backdrop_path" in df_temp.columns and pd.notna(movie.get("backdrop_path")):
                    backdrop_url = str(movie.get("backdrop_path"))

                elif "backdrop_url" in df_temp.columns and pd.notna(movie.get("backdrop_url")):
                    backdrop_url = str(movie.get("backdrop_url"))

                results.append({
                    "id": int(movie["id"]),
                    "title": str(movie["title"]),
                    "overview": str(movie["overview"]) if pd.notna(movie["overview"]) else "",
                    "release_date": str(movie["release_date"]) if pd.notna(movie["release_date"]) else "",
                    "year": int(movie["year"]) if pd.notna(movie["year"]) else None,
                    "genres": str(movie["genres"]) if pd.notna(movie["genres"]) else "",
                    "vote_average": float(movie["vote_average"]) if pd.notna(movie["vote_average"]) else 0.0,
                    "vote_count": int(movie["vote_count"]) if pd.notna(movie["vote_count"]) else 0,
                    "popularity": float(movie["popularity"]) if pd.notna(movie["popularity"]) else 0.0,
                    "original_language": str(movie["original_language"]) if pd.notna(movie["original_language"]) else "",
                    "poster_path": poster_url,
                    "backdrop_path": backdrop_url,
                    "score": float(movie["score"]) if pd.notna(movie["score"]) else 0.0
                })
            track_api(
                request=request,
                api_name="filter_movies",
                request_data=data,
                response_status="success"
            )

            return JsonResponse({
                "status": "success",
                "count": len(results),
                "results": results
            })

        except Exception as e:
            track_api(
            request=request,
            api_name="filter_movies",
            request_data=data if 'data' in locals() else None,
            response_status=f"failed: {str(e)}"
        )
            return JsonResponse({
                "status": "error",
                "message": str(e)
            })

    return JsonResponse({
        "status": "error",
        "message": "Only POST method allowed"
    })








from django.shortcuts import render, redirect
from django.contrib import messages

ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin"

def admin_login(request):

    if request.method == "POST":

        username = request.POST.get("username")
        password = request.POST.get("password")

        if (
            username == ADMIN_USERNAME and
            password == ADMIN_PASSWORD
        ):

            request.session["admin_logged_in"] = True

            return redirect("admin_dashboard")

        else:
            messages.error(
                request,
                "Invalid username or password"
            )

    return render(
        request,
        "admin_login.html"
    )

import csv
import os

from django.conf import settings
from django.shortcuts import render, redirect
from django.db.models import Count
from .models import GenreStatistic
from .models import Users, MovieReview, ApiTracking


def admin_dashboard(request):

    # =========================
    # ADMIN SESSION CHECK
    # =========================

    if not request.session.get("admin_logged_in"):
        return redirect("admin_login")

    # =========================
    # DASHBOARD STATS
    # =========================

    total_users = Users.objects.count()

    total_reviews = MovieReview.objects.count()

    total_api_hits = ApiTracking.objects.count()

    api_data = (
        ApiTracking.objects
        .values("api_name")
        .annotate(count=Count("id"))
        .order_by("-count")
    )

    latest_logs = (
        ApiTracking.objects
        .all()
        .order_by("-created_at")[:20]
    )

    # =========================
    # CSV FILE PATH
    # =========================

    csv_path = os.path.join(
        settings.BASE_DIR,
        "training",
        "movies1995-26.csv"
    )

    # =========================
    # SEARCH MOVIES
    # =========================

    movies = []

    search_query = request.GET.get("search", "").strip()

    if os.path.exists(csv_path):

        with open(csv_path, "r", encoding="utf-8") as file:

            reader = csv.DictReader(file)

            for row in reader:

                # SHOW ALL MOVIES IF SEARCH EMPTY
                if search_query == "":
                    movies.append(row)

                # FILTER MOVIES
                elif search_query.lower() in row["title"].lower():
                    movies.append(row)

    # LIMIT DISPLAY
    movies = movies[:8]

    # =========================
    # ADD MOVIE
    # =========================

    if request.method == "POST":

        new_movie = {
            "id": request.POST.get("id"),
            "title": request.POST.get("title"),
            "overview": request.POST.get("overview"),
            "release_date": request.POST.get("release_date"),
            "genre_ids": request.POST.get("genre_ids"),
            "popularity": request.POST.get("popularity"),
            "vote_average": request.POST.get("vote_average"),
            "vote_count": request.POST.get("vote_count"),
            "original_language": request.POST.get("original_language"),
            "origin_country": request.POST.get("origin_country"),
            "poster_url": request.POST.get("poster_url"),
            "banner_url": request.POST.get("banner_url"),
        }

        file_exists = os.path.exists(csv_path)

        with open(csv_path, "a", newline="", encoding="utf-8") as file:

            fieldnames = [
                "id",
                "title",
                "overview",
                "release_date",
                "genre_ids",
                "popularity",
                "vote_average",
                "vote_count",
                "original_language",
                "origin_country",
                "poster_url",
                "banner_url",
            ]

            writer = csv.DictWriter(
                file,
                fieldnames=fieldnames
            )

            # CREATE HEADER IF FILE EMPTY
            if os.path.getsize(csv_path) == 0:
                writer.writeheader()

            writer.writerow(new_movie)

        return redirect("admin_dashboard")

    # =========================
    # CONTEXT
    # =========================
    genre_stats = GenreStatistic.objects.all().order_by("-total_movies")
    context = {
        "total_users": total_users,
        "total_reviews": total_reviews,
        "total_api_hits": total_api_hits,
        "api_data": api_data,
        "latest_logs": latest_logs,
        "movies": movies,
        "search_query": search_query,
        "genre_stats": genre_stats,
    }

    return render(
        request,
        "admin_dashboard.html",
        context
    )