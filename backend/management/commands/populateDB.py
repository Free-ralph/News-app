import json
from django.core.management.base import BaseCommand, CommandError
from backend.models import Comment, Base, PollOptions
from datetime import datetime
from django.utils.text import slugify
import requests


class Command(BaseCommand):

    @staticmethod
    def getItemById(ID):
        url2 = f"https://hacker-news.firebaseio.com/v0/item/{ID}.json"
        payload2 = "{}"
        res = requests.request("GET", url2, data=payload2).json()
        return res

    @staticmethod
    def createComment(comment, parent):
        Comment.objects.create(
            text = comment['text'],
            base = parent,
            created_at = datetime.fromtimestamp(comment['time']),
            author = comment['by'],
        )
        
    # def add_arguments(self, parser):
    #     parser.add_argument('type')


    def handle(self, *args, **options):
        url = "https://hacker-news.firebaseio.com/v0/topstories.json"

        payload = "{}"
        response = requests.request("GET", url, data=payload)
        count = 0
        if response.status_code == 200:
            for ID in response.json():
                res = self.getItemById(ID)
                print(res['type'])
                try:
                    if res['type'] != 'comment':
                        if res['type'] == 'story':
                            instance = Base(
                                title = res['title'],
                                created_at = datetime.fromtimestamp(res['time']),
                                score = int(res['score']), 
                                author = res['by'], 
                                category = res['type'],
                                url = res['url']

                            )
                        elif res['type'] == 'job':
                            instance = Base(
                                title = res['title'],
                                url = res['url'],
                                text = res['text'], 
                                created_at = datetime.fromtimestamp(res['time']),
                                author = res['by'],
                                category = res['type']
                            )
                        elif res['type'] == 'poll':
                            instance = Base(
                                title = res['title'], 
                                category = res['type'],
                                created_at = datetime.fromtimestamp(res['time']),
                                text = res['text'],
                                score = int(res['score']),
                                author = res['by'],
                            )
                            instance.save()

                            for partID in json['parts']:
                                part = self.getItemById(partID)
                                pollOpt = PollOptions(
                                    base = instance,
                                    score = part['score'],
                                    created_at = datetime.fromtimestamp(part['time']),
                                    author = part['by'],
                                )
                                pollOpt.save()
                                for kidID in part['kids']:
                                    kid = self.getItemById(kidID)
                                    self.createComment(kid, pollOpt)

                        instance.save()
                        count += 1

                        if count == 95:
                            break
                        for kidID in res['kids']:
                            kid = self.getItemById(kidID)
                            self.createComment(kid, instance)
                except KeyError as e:
                    self.stdout.write(self.style.ERROR(e))
                    continue
            self.stdout.write(self.style.SUCCESS('database populated succesfully'))

        else:
            raise CommandError('data fetch failed')

        