# weatherDashboard


This is a weather information site that uses the Openweather API to provide you the current weather information and forecacst.

On loading of the site, it asks user for current location. If user grants permission, the site will get the users current geolocation and provide weather information on that location.

If the user denies the location request, the site will get the last address the user searched. If there is no search history and user denies location request, the site will not load any city and user can enter a city of his/her choice to get search results. 

This site also stores the last 10 user searches into local storage and show them under the searchbar. User can click on the buttons of these historical searches to get quick access to weather information in these locations. 