function getTimeZone(time, timezone) {
    let localTime = time.getTime(),
        localOffset = time.getTimezoneOffset() * 60000,
        utc = localTime + localOffset,
        newDate = utc + (timezone * 1000);
    newDate = new Date(newDate);
    return newDate;
};

function getTime(time) {
    let $hourlyTime = time.getHours(),
        $min = time.getMinutes();

    if ($min < 10) $min = '0' + $min.toString();

    switch (true) {
        case ($hourlyTime === 0):
            $hourlyTime = 12;
            $min += 'am';
            break;
        case ($hourlyTime === 12):
            $min += 'pm';
            break;
        case ($hourlyTime < 12):
            $min += 'am';
            break;
        default:
            $hourlyTime -= 12;
            $min += 'pm';
    };
    time = $hourlyTime.toString() + ':' + $min;
    return time;
};

function getRainChance(data) {
    return data * 100;
}

function getCity(data) {
    $country = data[0]['country'],
        $state = data[0]['state'];

    if ($country !== 'US') $state = $country;

    $lon = data[0]['lon'];
    $lat = data[0]['lat'];
};

function getData(data) {
    const $current = data['current'],
        $daily = data['daily'].filter((val, index) => {
            return index === 0;
        }),
        $hourly = data['hourly'].filter((val, index) => {
            return index >= 1 && index <= 8;
        }),
        $timezone = data['timezone_offset'],

        $weather = $current['weather'][0]['main'],
        $tempMax = $daily[0]['temp']['max'].toFixed(0),
        $temperature = $current['temp'].toFixed(0),
        $tempMin = $daily[0]['temp']['min'].toFixed(0),
        $cityHumidity = $current['humidity'],
        $weatherDescription = $current['weather'][0]['description'],
        $weatherIcon = $current["weather"][0]["icon"],
        $feelsLike = $current['feels_like'].toFixed(0),
        $windSpeed = $current['wind_speed'].toFixed(0),
        $sunRise = getTime(getTimeZone(new Date($current['sunrise'] * 1000), $timezone)),
        $uvIndex = $current['uvi'],
        $sunSet = getTime(getTimeZone(new Date($current['sunset'] * 1000), $timezone));

    $hourly.forEach(element => {
        $hourlyTime.push(getTimeZone(new Date(element.dt * 1000), $timezone).getHours());
        $hourlyIcon.push(element['weather'][0]['icon']);
        $hourlyTemp.push(element.temp.toFixed(0));
        $hourlyFeelsLike.push(element.feels_like.toFixed(0));
        $hourlyDescription.push(element['weather'][0]['description']);
        $hourlyRainChance.push((element['pop'] * 100).toFixed(0) + '%');
        $hourlyWindSpeed.push(element.wind_speed.toFixed(0));
        $hourlyHumidity.push(element.humidity);
    });

    $hourlyTime = $hourlyTime.map((value) => {
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

    /*switch ($weather) {
        case 'Clouds':
            $body.css('background', 'url(/images/rain.jpg)');
    };*/

    $city_name.append($city + '<br>' + '<span>' + $state + '</span>');
    $max.append('<img src="/images/up.png" alt = "down arrow"> ' + $tempMax + '&#176;');
    $temp.append($temperature + '&#176;');
    $min.append('<img src="/images/down.png" alt="up arrow"> ' + $tempMin + '&#176;');
    $description.append($weatherDescription);
    $icon.attr('src', 'http://openweathermap.org/img/wn/' + $weatherIcon + '@2x.png');
    $humidity.append('humidity ' + $cityHumidity + '%');
    $feels_like.append('feels like ' + $feelsLike + '&#176;');
    $wind_speed.append('wind speed ' + $windSpeed + 'mph');
    $sunrise.append('sunrise ' + $sunRise);
    $uv_index.append('uv index ' + $uvIndex);
    $sunset.append('sunset ' + $sunSet);

    $hourly_time.each((index, element) => {
        element.append($hourlyTime[index]);
    });

    let index = 0;
    for (i = 1; i <= 6; i++) {
        $('.hourly-icon' + i).attr('src', 'http://openweathermap.org/img/wn/' + $hourlyIcon[index] + '@2x.png');
        index++;
    }

    $hourly_temp.each((index, element) => {
        element.append($hourlyTemp[index]);
    });
    $hourly_temp.append('&#176;');

    $hourly_feels_like.each((index, element) => {
        element.append('feels like: ' + $hourlyFeelsLike[index]);
    });
    $hourly_feels_like.append('&#176;');

    $hourly_description.each((index, element) => {
        element.append($hourlyDescription[index]);
    });

    $hourly_rain_chance.append('<img src="/images/rainDrop.png" alt="rainDrop">');
    $hourly_rain_chance.each((index, element) => {
        element.append($hourlyRainChance[index]);
    });

    $hourly_wind_speed.each((index, element) => {
        element.append('wind-speed: ' + $hourlyWindSpeed[index] + 'mph');
    });

    $hourly_humidity.each((index, element) => {
        element.append('humidity ' + $hourlyHumidity[index] + '%');
    });
};

let $key = 'b18a17f280f5e12915af91620df8b8c4',
    $body = $('body'),
    $cityInput = $('.city-input'),
    $submit = $('.submit'),

    $city_name = $('.city-name'),
    $max = $('.max'),
    $temp = $('.temp'),
    $min = $('.min'),
    $description = $('.description'),
    $icon = $('.icon'),
    $feels_like = $('.feels-like'),
    $humidity = $('.humidity'),
    $wind_speed = $('.wind-speed'),
    $sunrise = $('.sunrise'),
    $uv_index = $('.uv-index'),
    $sunset = $('.sunset'),

    $hourly_time = $('.hourly-time'),
    $hourly_icon = $('.card img'),
    $hourly_temp = $('.hourly-temp'),
    $hourly_feels_like = $('.hourly-feels-like'),
    $hourly_description = $('.hourly-description'),
    $hourly_rain_chance = $('.hourly-rain-chance'),
    $hourly_wind_speed = $('.hourly-wind-speed'),
    $hourly_humidity = $('.hourly-humidity'),

    $hourlyTime = [],
    $hourlyIcon = [],
    $hourlyTemp = [],
    $hourlyFeelsLike = [],
    $hourlyDescription = [],
    $hourlyRainChance = [],
    $hourlyWindSpeed = [],
    $hourlyHumidity = [],

    $state = '',
    $country = '',
    $city = '',
    $lat = '38.5810606',
    $lon = '-121.493895';

fetch('https://api.openweathermap.org/geo/1.0/direct?q=london&appid=' + $key)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        $city = data[0]['name'];
        $country = data[0]['country'];
        $state = data[0]['state'];

        if ($country !== 'US') $state = $country;

        $lon = data[0]['lon'];
        $lat = data[0]['lat'];

        fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + $lat + '&lon=' + $lon +
            '&units=imperial&exclude=minutely,alerts&appid=' + $key)
            .then(response => response.json())
            .then(data => { console.log(data); getData(data) }) // end fetch
            .catch(err => alert(err));

    }) // end fetch
    .catch(err => alert(err));

$submit.click(() => {
    $hourlyTime = [];
    $hourlyIcon = [];
    $hourlyTemp = [];
    $hourlyFeelsLike = [];
    $hourlyDescription = [];
    $hourlyRainChance = [];
    $hourlyWindSpeed = [];
    $hourlyHumidity = [];

    $city_name.empty();
    $max.empty();
    $temp.empty();
    $min.empty();
    $humidity.empty();
    $description.empty();
    $feels_like.empty();
    $humidity.empty();
    $wind_speed.empty();
    $sunrise.empty();
    $uv_index.empty();
    $sunset.empty();
    $hourly_time.empty();
    $hourly_icon.empty();
    $hourly_temp.empty();
    $hourly_feels_like.empty();
    $hourly_description.empty();
    $hourly_rain_chance.empty();
    $hourly_wind_speed.empty();
    $hourly_humidity.empty();

    fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + $cityInput.val() + '&appid=' + $key)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            $city = data[0]['name'];
            $country = data[0]['country'];
            $state = data[0]['state'];

            if ($country !== 'US') $state = $country;

            $lon = data[0]['lon'];
            $lat = data[0]['lat'];

            fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + $lat + '&lon=' + $lon +
                '&units=imperial&exclude=minutely,alerts&appid=' + $key)
                .then(response => response.json())
                .then(data => { console.log(data); getData(data); }) // end fetch
                .catch(err => alert(err));
        }) // end fetch

        .catch(() => alert('Not a city name'));
}); // end click