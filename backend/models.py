from unicodedata import category
from django.db import models
from django.db.models import Q
from django.utils.text import slugify
class BaseManager(models.Manager):
    '''
    custom manager for searching by title or text or category
    '''
    def search(self, query):
        if not query:
            return self.get_queryset()
        lookups = (
            Q(title__icontains = query) |
            Q(text__icontains = query) |
            Q(category__icontains = query)
        )
        return self.get_queryset().filter(lookups).distinct()

class Base(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique = True, null = True)
    category = models.CharField(max_length = 100) #Categories are the types of items
    parts = models.ForeignKey('self', on_delete = models.CASCADE, null=True, blank=True)
    score = models.IntegerField(null=True, blank=True)
    author = models.CharField(max_length=100)
    url = models.URLField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now=True)
    text = models.TextField(null=True, blank=True)
    created_locally = models.BooleanField(default = False) # flags How this model was created
    objects = BaseManager()

    
    def __str__(self):
        return f"{self.category}{self.title}"
    
    def save(self, *args, **kwargs):
        self.slug = slugify(self.title + str(self.id))
        if not self.author:
            self.author = 'anonymous'
        super().save(*args, **kwargs)


class kids(models.Model):
    author = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now=True)
    kids = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        abstract = True


class Comment(kids):
    base = models.ForeignKey('Base', on_delete= models.CASCADE, related_name='comments')
    text = models.CharField(max_length=200)

    class Meta:
        ordering = ('-created_at', )

    def __str__(self):
        return self.author
    
    def save(self, *args, **kwargs):
        if not self.author:
            self.author = 'anonymous'

        return super().save(*args, **kwargs)
    
class PollOptions(kids):
    base = models.ForeignKey('Base', on_delete= models.CASCADE, related_name='pollOpts')
    score = models.IntegerField(null=True, blank=True)
    def __str__(self):
        return self.author
    
    class Meta:
        verbose_name_plural = 'Poll Options'


