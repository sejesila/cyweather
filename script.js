const timeEl = document.getElementById('time')
const dateEl = document.getElementById('date')
const currentWeatherItems = document.getElementById('current-weather-items')
const hourlyWeatherData = document.getElementById('weather-forecast')

setInterval(() => {
    let time = new Date()
    let month = time.getMonth()
    let date = time.getDate()
    let hours = time.getHours() 
    let hoursIn12HrFomart = hours>= 13 ? hours % 12 : hours
    let minutes = time.getMinutes()
    let ampm = hours >= 12 ? 'PM' : 'AM'

    timeEl.innerHTML = (hoursIn12HrFomart <10 ? "0" + hoursIn12HrFomart : hoursIn12HrFomart) + ':' + ( minutes < 10 ? "0" + minutes : minutes) + `<span id='am-pm'>${ampm}</span>`
   
}, 1000)
getHourlyWeatherData()
function getHourlyWeatherData() {
    navigator.geolocation.getCurrentPosition((success) => {
        console.log(success)

        let { latitude, longitude } = success.coords

        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relativehumidity_2m,cloudcover_mid,windspeed_120m&timezone=Africa%2FNairobi&current_weather=true`).then(res => res.json()).then(data => {
            console.log(data)
            showHourlyData(data)
        })
    })
}
function showHourlyData(data) {
    let { temperature, windspeed, humidity, cloudcover } = data.current_weather
        
    currentWeatherItems.innerHTML = 
    `<div class="weather-item" >
        
        <div>Temperature</div>
        <div>${temperature} &#176;C</div>
    </div>
    <div class="weather-item">  
        <div>Wind speed</div>
        <div>${windspeed} km/hr</div>
    </div>

   
    `;
    //let otherHoursForecast = '';
    for (x = 6; x <= 18; x++){
        
        let time_data = data.hourly.time[x]
        time_data = moment.utc(time_data).format("HH")
        console.log(time_data)
        // exract time from the iso_date_time_data
       //let time_data = iso_date_time_data.substring(11, 16)
    
       console.log(time_data.getHours)
        let timeIn12HrFomart = time_data >= 13 ? time_data % 12 : time_data

        let ampm =time_data>= 12 ? 'PM' : 'AM'
        let temp_data = data.hourly.temperature_2m[x]  
        let wind_data = data.hourly.windspeed_120m[x]
        let humidity_data  = data.hourly.relativehumidity_2m[x]   
        let cloud_data  = data.hourly.cloudcover_mid[x]  
    

        hourlyWeatherData.innerHTML += ` <div class="weather-forecast-item">
            <div class="hour"> ${(time_data > 12 ? "0" + timeIn12HrFomart : timeIn12HrFomart)}  <span id='am-pm'>${ampm}</span></div>
            <img alt="temp icon" src="">
            <div class="temp">${temp_data} &#176;C</div>
            <div class="wind-speed">${wind_data} km/hr</div>
            <div class="humidity">${humidity_data} &#37;</div>
            <div class="cloud-cover">${cloud_data} &#37;</div>
        </div>` 
  
    }
  

        

}