$(document).ready(function(){
    var historicalSearches = []
    var frontUrl = "https://api.openweathermap.org/data/2.5/weather?q="  
    var forecastFrontUrl = "https://api.openweathermap.org/data/2.5/forecast?q="
    var geoCoorUrl = "http://api.openweathermap.org/data/2.5/weather?"
    var geoCoorForecast = "http://api.openweathermap.org/data/2.5/forecast?"
    var uviUrl = "https://api.openweathermap.org/data/2.5/uvi?"
    var apiKey = "&units=imperial&appid=1a6304f914f966e5dc4a8226a424190d" 

    var currentLat = ""
    var currentLon = ""

    var loadStorage  = JSON.parse(localStorage.getItem("history")) 

    if (loadStorage == null){
    }else if (loadStorage.length>10){
        for(i=loadStorage.length-10; i<loadStorage.length; i++){
            historicalSearches[historicalSearches.length] = loadStorage[i]
            mkbtns(loadStorage[i].name)
        }
    } else{
        for(i=0; i<loadStorage.length; i++){
            historicalSearches[historicalSearches.length] = loadStorage[i]
            mkbtns(loadStorage[i].name)
        }
    }

//askes user for current location to get weather data based on geolocation
    navigator.geolocation.getCurrentPosition(success, error)

// when search btn clicked
$("#searchBtn").on("click", function(){
    var cityName = $("#searchBar").text().trim()
    console.log(cityName)
    console.log(typeof cityName)
    if(cityName == ""){
        $("#locationName").text("Please enter City Name")
        $("#searchBar").text("")
        return
    }else {
        $(".rightSec").show()
        var queryURL = frontUrl+cityName+apiKey
        $.getJSON(queryURL, displayApiDataCurrent)
            
        queryURL = forecastFrontUrl + cityName + apiKey
        $.getJSON(queryURL, displayApiDataForecast)
        
        historicalSearches[historicalSearches.length] = {name: cityName}
        localStorage.setItem("history", JSON.stringify(historicalSearches) )
        mkbtns(cityName)

    $("#searchBar").text("")
    }
})

//looking out for any clicks on .searchHis class btns
$(document).on("click", ".searchHis", temp)

//***************************************   FUNCTIONS  ************************************************ */

//gets current and forecast data on button click based on button text (for historical searches)
function getsWeatherbyCity(city){
    $(".rightSec").show()
    var queryURL = frontUrl+city+apiKey
    $.getJSON(queryURL, displayApiDataCurrent)
    queryURL = forecastFrontUrl + city + apiKey
    $.getJSON(queryURL, displayApiDataForecast)
}

function temp(){
    var queryURL = frontUrl+$(this).text()+apiKey
    $.getJSON(queryURL, displayApiDataCurrent)
    queryURL = forecastFrontUrl + $(this).text() + apiKey
    $.getJSON(queryURL, displayApiDataForecast)
    $("#searchBar").text("")
}

//make new buttons with each city searched
function mkbtns(city){
    var newBtn = $("<button class = 'searchHis'>")
        newBtn.text(city)
    $(".searchHistory").prepend(newBtn)
}

//function to run when current location is obtained
function success(position) {
    $(".rightSec").show()
    currentLat = "lat=" + position.coords.latitude
    currentLon = "lon=" + position.coords.longitude
    queryURL = geoCoorUrl + currentLat + "&" + currentLon + apiKey
    $.getJSON(queryURL, displayApiDataCurrent)
    queryURL = geoCoorForecast + currentLat + "&" + currentLon + apiKey
    $.getJSON(queryURL, displayApiDataForecast)
}

//action when current location is not able to be obtained
function error() {
    getsWeatherbyCity(historicalSearches[historicalSearches.length-1].name) 
  }

// converts unix date to mmm dd yyyy format
function dateConvert(unixDate){
    var dateStr = new Date(unixDate * 1000)
    var n = dateStr.toDateString()
    var displayStr = n.substring(4, n.length)
    return "(" + displayStr + ")"
}

//displays current weather data onto page
function displayApiDataCurrent (data){
                    $("#locationName").text(data.name + " " + dateConvert(data.dt))
                    var imgId = data.weather[0].icon
                    var tempImgUrl = "http://openweathermap.org/img/wn/" + imgId + "@2x.png"
                    $("#currentWeatherImg").attr("src", tempImgUrl)
                    $("#weatherState").text(data.weather[0].description)
                    $("#windSpd").text("Wind Speed: " + data.wind.speed + " MPH")
                    $("#highTemp").text("High Temp (F): " + data.main.temp_max)
                    $("#lowTemp").text("Low Temp (F): " + data.main.temp_min)
                    $("#currentTemp").text("Current Temp (F): " + data.main.temp)
                    $("#humid").text("Humidity: " + data.main.humidity +"%")
                    currentLat = "lat=" + data.coord.lat
                    currentLon = "lon=" + data.coord.lon
                    var queryURL = uviUrl + currentLat + "&" + currentLon + apiKey
                    $.getJSON(queryURL,function(response){
                        $("#uv").text("UV Index: "+response.value)
                    })
}

//displays forecast data onto page
function displayApiDataForecast(data){
    var counter = 0
    for (i=7; i<47; i+=8){
            $("#day" + counter + "Date").text(dateConvert(data.list[i].dt))
            var imgId = data.list[i].weather[0].icon
            var tempImgUrl = "http://openweathermap.org/img/wn/" + imgId + "@2x.png"
            $("#day" + counter + "Img").attr("src", tempImgUrl)
            $("#day" + counter + "St").text(data.list[i].weather[0].description)
            $("#day" + counter + "humid").text("Humidity: " + data.list[i].main.humidity + "%")
            $("#day" + counter + "Temp").text("Temp (F): " + data.list[i].main.temp)
        counter +=1   
    }
}

})