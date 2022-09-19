from typing import Generic
from urllib import request
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.response import Response
from .serializers import NewsFeedSerializer, NewsDetialSerializer, CommentSerializer, CreateStorySerializer
from rest_framework.generics import ListAPIView, GenericAPIView
from backend.models import Base, Comment
from rest_framework import status

from django.utils.text import slugify
from datetime import datetime
import requests as r

class AllNewsApiView(ListAPIView):
    serializer_class = NewsFeedSerializer
    
    def get_queryset(self):
        return Base.objects.all().order_by('-created_at')

class NewsByCategoryApiView(ListAPIView):
    serializer_class = NewsFeedSerializer

    def get_queryset(self):
        if self.kwargs['category'] == 'none' :
            return Base.objects.all().order_by('-created_at')
        return Base.objects.filter(category = self.kwargs['category']).order_by('-created_at')

class NewsSearchApiView(ListAPIView):
    serializer_class = NewsFeedSerializer

    def get_queryset(self):
        return Base.objects.search(self.request.GET.get('query')).order_by('-created_at')

class TopStoriesApiView(ListAPIView):
    '''
        return only the top 5 new with the most score
    '''
    serializer_class = NewsFeedSerializer

    def get_queryset(self):
        limit = self.kwargs['limit']
        return Base.objects.all().order_by('-score')[:limit]


class NewsDetailView(GenericAPIView):
    serializer_class = NewsDetialSerializer
    def get(self, request, *args, **kwargs):
        try:
            instance = Base.objects.get(slug = self.kwargs['slug'])
        except ObjectDoesNotExist : 
            return Response({'message' : 'Item does not exist'}, status= status.HTTP_400_BAD_REQUEST)
        
        return Response(self.get_serializer(instance).data)

class AddCommentApiView(GenericAPIView):
    serializer_class = CommentSerializer

    def post(self, request, *args, **kwargs):

        serializer = self.get_serializer(data = request.data)
        if serializer.is_valid():
            parent_id = serializer.validated_data['parent_id']
            text = serializer.validated_data['text']
            author = serializer.validated_data['author']
            try:
                parent_instance = Base.objects.get(id = parent_id)
            except ObjectDoesNotExist:
                return Response({'message' : 'something went wrong'}, status=status.HTTP_400_BAD_REQUEST)

            Comment.objects.create(
                base  = parent_instance, 
                text = text, 
                author = author
            )
            return Response({'message' :'created successfully'})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 




def getItemById(ID):
    url2 = f"https://hacker-news.firebaseio.com/v0/item/{ID}.json"
    payload2 = "{}"
    res = r.request("GET", url2, data=payload2).json()
    return res


def createComment(comment, parent):
    Comment.objects.create(
        text = comment['text'],
        base = parent,
        created_at = datetime.fromtimestamp(comment['time']),
        author = comment['by'],
    )

class DBSyncApiView(GenericAPIView):
    '''
    This view gets requested every 5 minutes to sync the DB with the Hacker News Api
    '''
    def get(self, reqeust, *args, **kwargs):
        url = "https://hacker-news.firebaseio.com/v0/topstories.json"

        payload = "{}"
        response = r.request("GET", url, data=payload)
        if response.status_code == 200:
            for ID in response.json():
                res = getItemById(ID)
                try:
                    if res['type'] != 'comment':
                        if res['type'] == 'story':
                            instance = Base(
                                title = res['title'],
                                created_at = datetime.fromtimestamp(res['time']),
                                score = int(res['score']), 
                                author = res['by'], 
                                category = res['type'],
                                url = res['url'])
                    ref_slug = slugify(instance.title + str(instance.id))
                    if Base.objects.filter(slug = ref_slug).exists():
                        break

                    instance.save()
                    for kidID in res['kids']:
                        kid = getItemById(kidID)
                        createComment(kid, instance)
                except KeyError as e:
                    continue
        else:
            return Response({'message' : 'DB sychronization failded'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'message' : 'DB Synchronized'})


class CreateStoryApiView(GenericAPIView):
    serializer_class = CreateStorySerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data = request.data)
        if serializer.is_valid():
            author = serializer.validated_data['author']
            title = serializer.validated_data['title']
            category = serializer.validated_data['category']

            base = Base(
                title = title,
                author = author, 
                category = category,
                created_locally = True
            )
            base.save()
            base_serializer = NewsDetialSerializer(base)
            return Response(base_serializer.data)
        else :
            return Response(serializer.errors, status= status.HTTP_400_BAD_REQUEST)

class DeleteStoryApiView(GenericAPIView):
    def get(self, *args, **kwargs):
        story_id = self.kwargs['id']
        try:
            story_instance = Base.objects.get(id = story_id)
        except ObjectDoesNotExist:
            return Response({'message' : 'something went wrong'}, status=status.HTTP_400_BAD_REQUEST)

        story_instance.delete()
        return Response({'message' : 'removed successfully'}) 
            

class UpdateStoryApiView(GenericAPIView):
    serializer_class = CreateStorySerializer

    def post(self, request, *args, **kwargs):
        slug = self.kwargs['slug']
        print(request.data) 
        try:
            story_instance = Base.objects.get(slug = slug)
        except ObjectDoesNotExist:
            return Response({'message' : 'something went wrong'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(data = request.data)
        if serializer.is_valid():
            story_instance.author = serializer.validated_data['author']
            story_instance.title = serializer.validated_data['title']
            story_instance.category = serializer.validated_data['category']

            story_instance.save()
            return Response({'message' : 'updated successfully'})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        



