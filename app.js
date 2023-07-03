const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const currentWeatherEl = document.getElementById("current-weather-items");
const timeZone = document.getElementById("time-zone");
const country = document.getElementById("country");
const weatherForecastEl = document.getElementById("weather-forecast");
const currentTempEl = document.getElementById("current-temp");

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Agu", "Sep", "Oct", "Nov", "Dec"];

const API_KEY = '73106aedfa4c333225792873f2368773';

setInterval(() =>{
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    let hour = time.getHours();
    let hourIn12HrsFormat = hour >=12 ?  hour % 12 : hour;
    let minutes = time.getMinutes();
    const amPm = hour >= 12 ? "PM" : "AM";


    hourIn12HrsFormat = digitoCero(hourIn12HrsFormat);
    minutes = digitoCero(minutes);
    
    function digitoCero(digito){
        digito = digito.toString();
        return digito.length < 2 ? "0" + digito : digito;
    }

    timeEl.innerHTML = hourIn12HrsFormat + ":" + minutes + `<span class="" id="am-pm">${amPm}</span>`;
    dateEl.innerHTML = days[day] + ", " + date + " " + months[month];

}, 1000);

getWeatherData();
function getWeatherData(){
    navigator.geolocation.getCurrentPosition((success) => {
        
        let {latitude, longitude} = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&cnt=6&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {
            console.log(data);
            showWeatherData(data);
        })

        

    })
}


twoWeatherData();
function twoWeatherData(){
    navigator.geolocation.getCurrentPosition((success) => {
        
        let {latitude, longitude} = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`).then(respuesta => respuesta.json()).then(information => {
            console.log(information);
            twoShowWeatherData(information);
        } )
})
}

function twoShowWeatherData(information){
    let {humidity, pressure} = information.main;
    let {speed} = information.wind;
    let {sunrise, sunset} = information.sys;

    timeZone.innerHTML = information.timezone;
    country.innerHTML = information.coord.lat + "N" + information.coord.lon + "E";

    currentWeatherEl.innerHTML = `
    <div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="weather-item">
        <div>Wind speed</div>
        <div>${speed}</div>
    </div>
    <div class="weather-item">
        <div>Sunrise</div>
        <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${window.moment(sunset * 1000).format('HH:mm a')}</div>
    </div>`

    currentTempEl.innerHTML = `
            <img src="https://openweathermap.org/img/wn/${information.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(information.dt * 1000).format('dddd')}</div>
                <div class="temp">Temp - ${information.main.temp}&#176; C</div>
                <div class="temp">Feels-like - ${information.main.feels_like}&#176; C</div>
            </div>`
}

    

function showWeatherData(data){
   
    let otherDayForecast = '';
    data.list.forEach((clima, idx)=>{
            otherDayForecast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(clima.dt * 1000).format('HH:mm a')}</div>
                <img src="https://openweathermap.org/img/wn/${clima.weather[0].icon}@2x.png" alt="weather icon" class="w-icon"> 
                <div class="temp">Temp - ${clima.main.temp}&#176; C</div>
                <div class="temp">Feels-like - ${clima.main.feels_like}&#176; C</div>
            </div>`
        
    })

    weatherForecastEl.innerHTML = otherDayForecast;
}