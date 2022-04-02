function filterWeather(value, index) {
    return index >= 1 && index <= 6;
};

function getTimeZone(time, timezone) {
    let localTime = time.getTime();
    let localOffset = time.getTimezoneOffset() * 60000;
    let utc = localTime + localOffset;
    let nd = utc + (timezone * 1000);
    nd = new Date(nd);
    return nd;
}

function getTime(time) {
    let $hours = time.getHours(),
        $min = time.getMinutes();

    switch (true) {
        case ($hours > 12 && $min < 10):
            $hours -= 12;
            $min = '0' + $min.toString() + 'pm';
            break;
        case ($hours > 12):
            $hours -= 12;
            $min += 'pm';
            break;
        case ($hours === 12 && $min < 10):
            $min = '0' + $min.toString() + 'pm';
        case ($hours === 12):
            $min += 'pm';
            break;
        case ($hours === 0):
            $hours = '12';
            $min += 'am';
            break;
        case ($min < 10):
            $min = '0' + $min.toString() + 'am';
            break;
        default:
            $min += 'am';
    };
    time = $hours.toString() + ':' + $min;
    return time;
}

let $key = 'b18a17f280f5e12915af91620df8b8c4',
    $cityInput = $('.city-input'),
    $submit = $('.submit'),
    $output = $('.output'),
    /*
    $cityName = $('.city-name'),
    $temperature = $('.temp'),
    $minMaxTemp = $('.min-max'),
    $icon = $('.icon'),
    $description = $('.description'),
    $feelsLike = $('feels-like'),
    $windSpeed = $('.wind-speed'),
    $sunrise = $('.sunrise'),
    $sunset = $('sunset'),*/

    $hourly_time = $('.card h4'),
    $hourly_temp = $('.hourly-temp'),
    $hourly_wind_speed = $('.card p:last-child'),
    $lat = '38.5810606',
    $lon = '-121.493895',
    $state = '';

fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + $lat + '&lon=' + $lon +
    '&units=imperial&exclude=daily,current,minutely,alerts&appid=' + $key)
    .then(response => response.json())
    .then(data => { console.log(data); });
fetch('https://api.openweathermap.org/data/2.5/weather?lat=' +
    $lat + '&lon=' + $lon + '&units=imperial&appid=' + $key)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        let timezone = data.timezone;
        let time = new Date(data.dt * 1000);
        localTime = time.getTime();
        localOffset = time.getTimezoneOffset() * 60000;
        utc = localTime + localOffset;
        let nd = utc + (timezone * 1000);
        nd = new Date(nd);
        console.log(nd);
    })

$submit.click(() => {
    let $hours = [],
        $hourlyTemp = [],
        $hourlyFeelsLike = [],
        $hourlyWindSpeed = [];

    $output.empty();
    /*$cityName.empty();
    $temperature.empty();
    $minMaxTemp.empty();
    $windSpeed.empty();*/
    $hourly_time.empty();
    $hourly_temp.empty();
    $hourly_wind_speed.empty();

    fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + $cityInput.val() + '&appid=' + $key)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            $state = data[0]['state'];
            $lon = data[0]['lon'];
            $lat = data[0]['lat'];

            fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + $lat + '&lon=' + $lon +
                '&units=imperial&exclude=daily,current,minutely,alerts&appid=' + $key)
                .then(response => response.json())
                .then(data => {
                    let timezone = data['timezone_offset'];
                    data = data['hourly'].filter(filterWeather);
                    console.log(data);
                    data.forEach(element => {
                        $hours.push(getTimeZone(new Date(element.dt * 1000), timezone).getHours());
                        $hourlyTemp.push(element.temp.toFixed(0));
                        $hourlyFeelsLike.push(element.feels_like.toFixed(0));
                        $hourlyWindSpeed.push(element.wind_speed.toFixed(0));
                    });

                    //console.log($hours);

                    $hours = $hours.map((value) => {
                        console.log(value)
                        switch (true) {
                            case (value === 0):
                                value = '12am';
                                break;
                            case (value === 12):
                                value = '12pm';
                                break;
                            case (value < 12):
                                value += 'am';
                                break;
                            default:
                                value -= 12
                                value += 'pm';
                        }
                        return value;
                    });

                    $hourly_time.each((index, element) => {
                        element.append($hours[index]);
                    });

                    $hourly_temp.each((index, element) => {
                        element.append($hourlyTemp[index]);
                    });
                    $hourly_temp.append('&#176;');

                    $hourly_wind_speed.each((index, element) => {
                        element.append('feels like: ' + $hourlyFeelsLike[index]);
                    });
                    $hourly_wind_speed.append('&#176;' + '<br>')
                    $hourly_wind_speed.each((index, element) => {
                        element.append('wind speed ' + $hourlyWindSpeed[index] + 'mph');
                    });
                }) // end fetch
                .catch(err => alert(err));

            fetch('https://api.openweathermap.org/data/2.5/weather?lat=' +
                $lat + '&lon=' + $lon + '&units=imperial&appid=' + $key)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    let $city_Name = data['name'],
                        $city_Temp = data['main']['temp'].toFixed(0),
                        $temp_max = data['main']['temp_max'].toFixed(0),
                        $temp_min = data['main']['temp_min'].toFixed(0),
                        $weather_description = data['weather'][0]['description'],
                        $weather_icon = data['weather'][0]['icon'],
                        $feels_Like = data['main']['feels_like'].toFixed(0),
                        $wind_speed = data['wind']['speed'].toFixed(0),
                        $sun_rise = getTime(getTimeZone(new Date(data['sys']['sunrise'] * 1000), data.timezone)),
                        $sun_set = getTime(getTimeZone(new Date(data['sys']['sunset'] * 1000), data.timezone));

                    $output.append('<h3 class="city-name">' + $city_Name + '<br>' + '<span>' + $state + '</span>' + '</h3>' +
                        '<div class="temperature">' +
                        '<p class="temp">' + $city_Temp + '&#176;' + '</p>' +
                        '<p class="max-min">' + 'max' + $temp_max + '&#176;' + '/' + 'min' + $temp_min + '&#176;' + '</p></div>' +
                        '<div class="icon-description">' +
                        '<img class="icon" src="http://openweathermap.org/img/wn/' + $weather_icon + '@2x.png"' + 'alt="icon">' +
                        '<p class="description">' + $weather_description + '</p></div>' +
                        '<hr>' +
                        '<div class="weather-details">' +
                        '<p class="feels-like">feels like: ' + $feels_Like + '&#176;</p>' +
                        '<p class="wind-speed">wind speed: ' + $wind_speed + 'mph</p></div>' +
                        '<div class="sunrise-sunset">' +
                        '<p class="sunrise">sunrise: ' + $sun_rise + '</p>' +
                        '<p class="sunset">sunset: ' + $sun_set + '</p></div>');



                }) // end fetch
                .catch(err => alert(err));
        }) // end fetch

        .catch(() => alert('Not a city name'));
}); // end click