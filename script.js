const timeEl = document.getElementById('time')
const dateEl = document.getElementById('date')
const currentWeatherItems = document.getElementById('current-weather-items')
const hourlyWeatherData = document.getElementById('weather-forecast')
const lat = document.getElementById('lat')
const long = document.getElementById('long')
const wrapper = document.querySelector('.wrapper')
inputPart = wrapper.querySelector('.input-part')

locationBtn = inputPart.querySelector('button')

setInterval(() => {
    let time = new Date()
    let month = time.getMonth()
    let date = time.getDate()
    let day = time.getDay()
    let hours = time.getHours()
    let hoursIn12HrFormat = hours >= 13 ? hours % 12 : hours
    let minutes = time.getMinutes()
    let ampm = hours >= 12 ? 'PM' : 'AM'

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'August', 'Sept', 'Oct', 'Nov', 'Dec']


    timeEl.innerHTML = (hoursIn12HrFormat < 10 ? "0" + hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10 ? "0" + minutes : minutes) + `<span id='am-pm'>${ampm}</span>`
    dateEl.innerHTML = days[day] + ',' + ' ' + date + ' ' + months[month]

}, 1000)
getHourlyWeatherData()

function getHourlyWeatherData() {
    navigator.geolocation.getCurrentPosition((success) => {

        let {latitude, longitude} = success.coords

        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relativehumidity_2m,cloudcover_mid,windspeed_120m&timezone=Africa%2FNairobi&current_weather=true`)
            .then(res => res.json()).then(data => {
            //console.log(data)
            showHourlyData(data)
        })
    })
}

lat.addEventListener("keyup",e=>{
    if(lat.value !== ""){
        getData(lat.value,long.value)
        hourlyWeatherData.innerHTML = ''

    }
})

locationBtn.addEventListener('click',()=>{
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess,onError);
    }
    else {
        alert("Your browser does not support geolocation api")
    }

})

function onSuccess(position) {
    hourlyWeatherData.innerHTML = ''
    let {latitude, longitude} = position.coords
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relativehumidity_2m,cloudcover_mid,windspeed_120m&timezone=Africa%2FNairobi&current_weather=true`).then(res => res.json()).then(data => {
        //console.log(data)
        long.value = 'latitude'
        lat.value = 'longitude'
        showHourlyData(data)
    })
}

function onError(error) {
    console.log(error)
}
long.addEventListener("keyup",e=>{
    if(lat.value !== ""){
        getData(long.value,lat.value)
        hourlyWeatherData.innerHTML = ''

    }
})


function getData(latitude,longitude) {


        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relativehumidity_2m,cloudcover_mid,windspeed_120m&timezone=Africa%2FNairobi&current_weather=true`)
            .then(res => res.json()).then(data => {
            //console.log(data)
            showHourlyData(data)
        })

}

function showHourlyData(data) {
    let {temperature, windspeed} = data.current_weather

    currentWeatherItems.innerHTML =
        `<div class="weather-item" >
        
        <div>Temperature</div>
        <div>${temperature} &#176;C</div>
    </div>
    <div class="weather-item">  
        <div>Windspeed &nbsp;</div>
        <div>${windspeed}km/h</div>
    </div>

   
    `;
    //let otherHoursForecast = '';
    for (let x = 6; x <= 18; x++) {

        let time_data = data.hourly.time[x]
        time_data = moment.utc(time_data).format("HH")
        //let time_data = iso_date_time_data.substring(11, 16)
        let timeIn12HrFomart = time_data >= 13 ? time_data % 12 : time_data

        let ampm = time_data >= 12 ? 'PM' : 'AM'
        let temp_data = data.hourly.temperature_2m[x]
        let wind_data = data.hourly.windspeed_120m[x]
        let humidity_data = data.hourly.relativehumidity_2m[x]
        let cloud_data = data.hourly.cloudcover_mid[x]


        hourlyWeatherData.innerHTML += ` <div class="weather-forecast-item">
            <div class="hour"> ${(time_data > 12 ? "0" + timeIn12HrFomart : timeIn12HrFomart)}  <span id='am-pm'>${ampm}</span></div>
            <div class="each-weather-item">
             <i class="fa fa-thermometer-half" aria-hidden="true"></i>
            <div class="temp">${temp_data} &#176;C</div>
            </div>
            <div class="each-weather-item wind-speed">
            <i class="fas fa-wind"></i>
            <div class="">${wind_data}km/h</div>
            </div>
            <div class="each-weather-item">
            <img src="images/humidity.png"/>
            <div class="humidity">${humidity_data} &#37;</div>
            </div>
            <div class="each-weather-item">
            <i class="fa-solid fa-cloud"></i>
            <div class="cloud-cover">${cloud_data} &#37;</div>
            </div>
        </div>`

    }


}