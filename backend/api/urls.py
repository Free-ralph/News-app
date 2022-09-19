from django.urls import path
from .views import (
    AllNewsApiView, NewsByCategoryApiView, 
    NewsSearchApiView, TopStoriesApiView,
    NewsDetailView, AddCommentApiView, 
    DBSyncApiView, CreateStoryApiView, 
    DeleteStoryApiView, UpdateStoryApiView)


urlpatterns = [
    path('news', AllNewsApiView.as_view()),
    path('news/search', NewsSearchApiView.as_view()),
    path('news-by-category/<str:category>', NewsByCategoryApiView.as_view()),
    path('top-news/<int:limit>', TopStoriesApiView.as_view()),
    path('news-by-slug/<slug:slug>', NewsDetailView.as_view()),
    path('add-comment', AddCommentApiView.as_view()),
    path('add-story', CreateStoryApiView.as_view()),
    path('delete-story/<int:id>', DeleteStoryApiView.as_view()),
    path('update-story/<slug:slug>', UpdateStoryApiView.as_view()),

    path('sychronize-DB', DBSyncApiView.as_view()),

    
]