# TwitFriends

Checks if two Twitter users are following each other (friends).
Makes three Twitter API calls: One GET friendships/show call, and two GET users/show calls to fetch the profile picture of both users.

## The Two Types of API Requests Made:

### GET users/show
The user object contains the profile_image_url and profile_image_url_https fields. These fields will contain the resized “normal” variant of the user’s uploaded image. This “normal” variant is typically 48px by 48px.

### GET friendships/show
Returns detailed information about the relationship between two arbitrary users.

 
