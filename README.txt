This project was built with react at the frontend and django at the backend

API Endpoints
'/news' returns all the news items present in the DB
'/news/search?query' allows you to filter by text
'news-by-category/<str:category>' filters by category
'top-news/<int:limit>' returns Top stories ordered by the highest score, limit specifies the maximum to be returned 
'news-by-slug/<slug:slug>' return a single News object matching the provided slug
'add-comment' allows you to add comments
'add-story' allows you to add news/stories of different types
'delete-story/<int:id>' allows for the deletion of news/stories created through the API
'update-story/<slug:slug>' allows for the update of new/stories created through the API
'sychronize-DB' called every 5 minutes to sychronise the local DB with the external API's DB