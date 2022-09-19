from rest_framework import serializers
from backend.models import Base, Comment



CATEGORIES = (
    ('', ''), 
    ('story', 'story'), 
    ('poll', 'poll'), 
    ('job', 'job' )
)

class NewsFeedSerializer(serializers.ModelSerializer):
    '''
        list view for all news items
    '''

    class Meta:
        model = Base
        fields = [
            'id',
            'slug',
            'title', 
            'category', 
            'created_at',
            'author',
            'url',
            'text',
            'created_locally'
        ]


class NewsDetialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Base
        depth = 1
        fields = [
            'id',
            'slug',
            'title', 
            'category', 
            'created_at',
            'author',
            'comments',
            'url',
            'text',
        ]


class CommentSerializer(serializers.Serializer):
    text = serializers.CharField()
    author = serializers.CharField(required = False, allow_blank = True)
    parent_id = serializers.IntegerField()

class CreateStorySerializer(serializers.Serializer):
    title = serializers.CharField()
    category = serializers.ChoiceField(choices=CATEGORIES)
    author = serializers.CharField(required = False, allow_blank = True)
    text = serializers.CharField(required = False, allow_blank = True)

    def validate_category(self, category):
        if not category:
            raise serializers.ValidationError('This field is required')
        return category