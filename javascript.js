$(document).ready(function(){
    var historicalSearches = []
    var frontUrl = "https://api.openweathermap.org/data/2.5/weather?q="  
    var forecastFrontUrl = "https://api.openweathermap.org/data/2.5/forecast?q="
    var apiKey = "&appid=1a6304f914f966e5dc4a8226a424190d" 
    

    var loadStorage  = JSON.parse(localStorage.getItem("history")) 
    if (loadStorage == null){
    }else{
        for(i=0; i<loadStorage.length; i++){
            mkbtns(loadStorage[i].name)
        }
    }

$("#searchBtn").on("click", function(){
 
    var cityName = $("#searchBar").text()
    var queryURL = frontUrl+cityName+apiKey
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        console.log(response)
        $("#locationName").text(response.name)
        var imgId = response.weather[0].icon
        var tempImgUrl = "http://openweathermap.org/img/wn/" + imgId + "@2x.png"
        $("#currentWeatherImg").attr("src", tempImgUrl)
        $("#weatherState").text("Weather State: " + response.weather[0].description)
        $("#windSpd").text("Wind Speed: " + response.wind.speed)
        $("#highTemp").text("High Temp: " + response.main.temp_max)
        $("#lowTemp").text("Low Temp: " + response.main.temp_min)
        $("#currentTemp").text("Current Temp: " + response.main.temp)

        queryURL = forecastFrontUrl + cityName + apiKey
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
            console.log(response)
            for (i=0; i<5; i++){
                    var imgId = response.list[i].weather[0].icon
                    var tempImgUrl = "http://openweathermap.org/img/wn/" + imgId + "@2x.png"
                    $("#day" + i + "Img").attr("src", tempImgUrl)
                    $("#day" + i+ "St").text("Weather State: " + response.list[i].weather[0].description)
                    $("#day" + i + "Wd").text("Wind Speed: " + response.list[i].wind.speed)
                    $("#day" + i + "Hi").text("High Temp: " + response.list[i].main.temp_max)
                    $("#day" + i + "Lo").text("Low Temp: " + response.list[i].main.temp_min)
            }

        })
    })
    
    historicalSearches[historicalSearches.length] = {name: cityName}
    localStorage.setItem("history", JSON.stringify(historicalSearches) )
    console.log(historicalSearches)
    mkbtns(cityName)
})
})

function mkbtns(city){
    var newBtn = $("<button class = 'searchHis'>")
        newBtn.text(city)
    $(".searchHistory").prepend(newBtn)
}