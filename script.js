window.addEventListener('DOMContentLoaded', () => {
    const btnAdd = document.querySelector('.img');
    const startScreen = document.querySelector('.start-screen');
    const cityChooseBtn = document.querySelector('.city-choose-btn');
    const tabColumn = document.querySelector('.tab-column');
    const weatherTabWrapper = document.querySelector('.weather-tab-wrapper');
    // const loadingScreen = document.querySelector('.loading-screen');

    const locations = [];

    //functions
    const getAPI = function (city) {
        // return new Promise((resolve) => {
        //     const request = new XMLHttpRequest();
        //     request.open('GET', `https://api.weatherapi.com/v1/forecast.json?key=e3ea5926f9074031a78195423230312&q=${city}&days=3&lang=ru`);
        //     request.send();
        //     request.addEventListener('load', () => {
        //         if (request.status === 200) {
        //             resolve(JSON.parse(request.response));
        //         }

        //     });
        // });
        return fetch(`https://api.weatherapi.com/v1/forecast.json?key=e3ea5926f9074031a78195423230312&q=${city}&days=3&lang=ru`)
            .then(response => response.json());
    }


    const hideAll = function () {
        const weatherTabs = document.querySelectorAll('.weather-tab');
        weatherTabs.forEach((item) => {
            item.classList.add('hide');
        });
        weatherTabWrapper.classList.add('hide');
        startScreen.classList.add('hide');
    }


    const showTab = function (item) {
        const weatherTabs = document.querySelectorAll('.weather-tab');
        for (let i = 0; i < weatherTabs.length; i++) {
            if (item == i || item == weatherTabs[i]) {
                weatherTabWrapper.classList.remove('hide');
                weatherTabs[i].classList.remove('hide');
            }
        }
    }


    const createTab = function (result) {
        const newTab = document.createElement('div');
        const newWeatherTab = document.createElement('div');
        newTab.classList.add('button-city');
        newWeatherTab.classList.add('weather-tab');
        newTab.innerHTML = `${result.location.name}`;
        newWeatherTab.innerHTML = `
<div class="city-title">
    <div class="timezone">
        <div class="utc">UTC</div>
        <div class="zone">${removeZero(moment.tz(result.location.tz_id).format('Z').split('').splice(0, 3).join(''))}</div>
    </div>
    ${result.location.name}
    <div class="time">${addZero(new Date(result.location.localtime).getHours())}:${addZero(new Date(result.location.localtime).getMinutes())}</div>
</div>
<div class="wrapper">
    <div class="half-wrapper">
        <div class="half-wrapper-first">
            <div class="weather-temp">${(result.current.temp_c).toFixed(0)}°C</div>


        </div>

        <div class="weather-params">
            <div class="half-wrapper-first">
                <div class="weather-conditions">${result.current.condition.text}</div>
                <img class="img-weather" src="${result.current.condition.icon}">
            </div>
            <div class="weather-parameter">Ощущается как: ${(result.current.feelslike_c).toFixed(0)}°C</div>
            <div class="weather-parameter">Влажность: ${result.current.humidity}%</div>
            <div class="weather-parameter">Скорость ветра: ${(result.current.wind_kph * 1000 / 3600).toFixed(1)} м/с</div>
            <div class="weather-parameter">Направление ветра: ${windDirection(result.current.wind_dir)}</div>
            <div class="weather-parameter">Давление: ${(result.current.pressure_in / 25.4).toFixed(1)} мм.рт.ст</div>
            <div class="weather-parameter">УФ-индекс: ${result.current.uv}</div>
            <!-- <div class="weather-parameter">Облачность: малооблачно</div> -->

        </div>
    </div>
    <div class="half-wrapper">
        <div class="forecast" style="border-top: 0;">
            <div>Завтра</div>
            <div class="flex-panel">
                <div class="temp-forecast">${(result.forecast.forecastday[1].day.avgtemp_c).toFixed(0)}°C</div>
                
                <img class="img-weather" src="${result.forecast.forecastday[1].day.condition.icon}">
            </div >
            <div class="conditions-forecast">${result.forecast.forecastday[1].day.condition.text}</div>
            <div class="forecast-parameter">Скорость ветра: ${(result.forecast.forecastday[1].day.maxwind_kph * 1000 / 3600).toFixed(1)} м/с</div>
            <div class="forecast-parameter">УФ-индекс: ${result.forecast.forecastday[1].day.uv}</div>
            <div class="forecast-parameter">Влажность: ${result.forecast.forecastday[1].day.avghumidity}%</div>
        </div >
            <div class="forecast">
                <div>${new Date(result.forecast.forecastday[2].date).getDate()}.${new Date(result.forecast.forecastday[2].date).getMonth() + 1}</div >
                <div class="flex-panel">
                    <div class="temp-forecast">${(result.forecast.forecastday[2].day.avgtemp_c).toFixed(0)}°C</div>

                    <img class="img-weather" src="${result.forecast.forecastday[2].day.condition.icon}">
                </div>
                <div class="conditions-forecast">${result.forecast.forecastday[2].day.condition.text}</div>
                <div class="forecast-parameter">Скорость ветра: ${(result.forecast.forecastday[2].day.maxwind_kph * 1000 / 3600).toFixed(1)} м/с</div>
                <div class="forecast-parameter">УФ-индекс: ${result.forecast.forecastday[2].day.uv}</div>
                <div class="forecast-parameter">Влажность: ${result.forecast.forecastday[2].day.avghumidity}%</div>
            </div >
    </div >

</div > `;
        tabColumn.insertBefore(newTab, tabColumn.firstChild);
        weatherTabWrapper.insertBefore(newWeatherTab, weatherTabWrapper.firstChild);
        hideAll();
        showTab(newWeatherTab);
        locations.push(result.location.name);
        localStorage.setItem('APIlocations', JSON.stringify(locations));

    }

    const addZero = function (num) {
        if (num < 10) {
            return `0${num}`
        }
        return num
    }


    const windDirection = function (direction) {
        switch (direction) {
            case 'N': return 'Сев.'
            case 'NNE': return 'ССВ'
            case 'NE': return 'СВ'
            case 'ENE': return 'ВСВ'
            case 'E': return 'Вос.'
            case 'ESE': return 'ВЮВ'
            case 'SE': return 'ЮВ'
            case 'SSE': return 'ЮЮВ'
            case 'S': return 'Юж.'
            case 'SSW': return 'ЮЮЗ'
            case 'SW': return 'ЮЗ'
            case 'WSW': return 'ЗЮЗ'
            case 'W': return 'Зап.'
            case 'WNW': return 'ЗСЗ'
            case 'NW': return 'СЗ'
            case 'NNW': return 'ССЗ'
            default: return direction
        }
    }


    const removeZero = function (str) {
        const sign = str.split('').splice(0, 1).join('');
        const num = str.split('');
        num.splice(0, 1);
        if (+num[0] == 0) {
            return sign + num[1]
        }
        return str
    }

    //saved locations
    if (localStorage.getItem('APIlocations')) {
        const location = JSON.parse(localStorage.getItem('APIlocations'));
        for (let i = 0; i < location.length; i++) {
            getAPI(location[i])
                .then(result => {
                    createTab(result);
                });
        }
    }

    if (!(localStorage.getItem('APIlocations'))) {
        startScreen.classList.remove('hide');
        weatherTabWrapper.classList.add('hide');
    }


    //Event listeners
    btnAdd.addEventListener('click', () => {
        hideAll();
        startScreen.classList.remove('hide');
    });

    cityChooseBtn.addEventListener('click', () => {
        if (document.querySelector('.city-choose-input').value) {
            getAPI(document.querySelector('.city-choose-input').value)
                // .then(response => response.json())
                .then(result => {
                    createTab(result);
                });
        }
    });

    tabColumn.addEventListener('click', (event) => {
        const buttonCity = document.querySelectorAll('.button-city');
        if (event.target.classList.contains('button-city')) {
            for (let i = 0; i < buttonCity.length; i++) {
                if (event.target == buttonCity[i]) {
                    hideAll();
                    showTab(i);
                }
            }
        }
    });

    // window.addEventListener('load', () => {
    //     // setTimeout(() => {
    //     tabWrapper.classList.remove('hide');
    //     loadingScreen.style.display = 'none';
    //     // }, 300)
    // });
});

