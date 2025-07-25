
const userLocation = document.querySelector('#userLocation');
const converter = document.querySelector('#converter');
const weatherIcon = document.querySelector('.weatherIcon img');
const temprature = document.querySelector('.temprature');
const feelsLike = document.querySelector('.feelsLike');
const description = document.querySelector('.description');
const date = document.querySelector('.date');
const city = document.querySelector('.city');
const image = document.querySelector('.weatherIcon img');

const HValue = document.querySelector('#HValue');
const WValue = document.querySelector('#WValue');
const SRValue = document.querySelector('#SRValue');
const SSValue = document.querySelector('#SSValue');
const CValue = document.querySelector('#CValue');
const UVValue = document.querySelector('#UVValue');
const PValue = document.querySelector('#PValue');

const Forecast = document.querySelector('.forecast');

WEATHER_API_ENDPOINT = `https://api.openweathermap.org/data/2.5/weather?appid=5c843328029cf40229c552f31094edb8&q=`;
WEATHER_DATA_ENDPOINT = `https://api.openweathermap.org/data/2.5/onecall?appid=5c843328029cf40229c552f31094edb8&exclude=minutely&units=metric&`;

function findUserLocation() {
    Forecast.innerHTML = "";
    fetch(WEATHER_API_ENDPOINT + userLocation.value.trim())
        .then((response) => response.json())
        .then((data) => {
            if (data.cod != "" && data.cod != 200) {
                alert(data.message);
                return;
            }
            console.log(data);

            weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
            // temprature.innerHTML = `${parseInt(data.main.temp - 273.15)} ºC`;
            temprature.innerHTML = tempConverter(data.main.temp - 273.15);
            feelsLike.innerHTML = `Feels Like ${tempConverter(data.main.feels_like - 273.15)}`;
            description.innerHTML = `<i class="fa-brands fa-cloudversify"></i> &nbsp ${data.weather[0].description}`;

            const options = {
                weekday: "long",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: 'numeric',
                hour12: true
            }
            date.innerHTML = getLongFormatDateTime(data.dt, data.timezone, options);
            city.innerHTML = data.name + ', ' + data.sys.country;
            HValue.innerHTML = data.main.humidity;
            WValue.innerHTML = `${data.wind.speed} km/h`;

            const options1 = {
                hour: "numeric",
                minute: "numeric",
                hour12: true
            };
            SRValue.innerHTML = getLongFormatDateTime(data.sys.sunrise, data.timezone, options1);
            SSValue.innerHTML = getLongFormatDateTime(data.sys.sunset, data.timezone, options1);
            CValue.innerHTML = `${data.clouds.all}%`;
            PValue.innerHTML = `${data.main.pressure} hPa`;

        });

    const weatherApi = `http://api.weatherapi.com/v1/forecast.json?key=7c8cbb0f13cd4767a3b200332250306&q=${userLocation.value.trim()}&days=3&aqi=no&alerts=no`;
    fetch(weatherApi)
        .then((response) => response.json())
        .then((data) => {
            if (data.current.uv === 0) {
                UVValue.innerHTML = 'N/A';
            } else {
                UVValue.innerHTML = data.current.uv;
            }


            console.log(data.forecast.forecastday);
            data.forecast.forecastday.forEach((weather) => {
                let div = document.createElement("div");

                div.innerHTML += `<h2>${weather.date}</h2>`
                div.innerHTML += `<img src="${weather.day.condition.icon}" />`;;
                div.innerHTML += `<p class="forecast-desc">${weather.day.condition.text}</p>`
                div.innerHTML += `Min ${tempConverter(weather.day.mintemp_c)}, Max ${tempConverter(weather.day.maxtemp_c)}`;

                Forecast.append(div);
            })
        });
}

function formatUnixTime(dtVAlue, offset, options = {}) {
    const date = new Date((dtVAlue + offset) * 1000);
    return date.toLocaleTimeString([], { timeZone: "UTC", ...options });
}

function getLongFormatDateTime(dtVAlue, offset, options) {
    return formatUnixTime(dtVAlue, offset, options);
}

function tempConverter(temp) {
    let tempValue = Math.round(temp);
    let message = "";
    if (converter.value == "C") {
        message = `${tempValue + "\xB0C"}`;
    } else {
        let ctof = (tempValue * 9) / 5 + 32;
        message = `${ctof + "\xB0F"}`;
    }
    return message;
}