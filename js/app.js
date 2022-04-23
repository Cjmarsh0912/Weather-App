// changes the time to be accurate to whatever city is specified
function getTimeZone(time, timezone) {
    let localTime = time.getTime(),
        localOffset = time.getTimezoneOffset() * 60000,
        utc = localTime + localOffset,
        newDate = utc + (timezone * 1000);
    newDate = new Date(newDate);
    return newDate;
};

// get the time in the following format: 12:30pm
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

// get the date in the following format: Sat 11
function getDate(date) {
    let day = date.getDay(),
        dayOfMonth = date.getDate();

    switch (day) {
        case 0:
            day = 'Sun';
            break;
        case 1:
            day = 'Mon';
            break;
        case 2:
            day = 'Tue';
            break;
        case 3:
            day = 'Wed';
            break;
        case 4:
            day = 'Thur';
            break;
        case 5:
            day = 'Fri';
            break;
        case 6:
            day = 'Sat';
            break;
    }
    date = day + ' ' + dayOfMonth;
    return date;
}
// gets the percent chance for rain for the specified city
function getRainChance(data) {
    return data * 100;
};

// gets and sets the weather data of a specified city
function setData(data) {
    const $current = data['current'],
        $daily = data['daily'].filter((val, index) => {
            return index >= 0 && index <= 5;
        }),
        $hourly = data['hourly'].filter((val, index) => {
            return index >= 0 && index <= 12;
        }),
        $timezone = data['timezone_offset'],

        // sets all the weather data in the appropriate variable
        $tempMax = $daily[0]['temp']['max'].toFixed(0),
        $temperature = $current['temp'].toFixed(0),
        $tempMin = $daily[0]['temp']['min'].toFixed(0),
        $currentHumidity = $current['humidity'],
        $weatherDescription = $current['weather'][0]['description'],
        $weatherIcon = $current["weather"][0]["icon"],
        $feelsLike = $current['feels_like'].toFixed(0),
        $windSpeed = $current['wind_speed'].toFixed(0),
        $sunRise = getTime(getTimeZone(new Date($current['sunrise'] * 1000), $timezone)),
        $uvIndex = $current['uvi'].toFixed(0),
        $sunSet = getTime(getTimeZone(new Date($current['sunset'] * 1000), $timezone));

    $hourly.forEach(element => {
        $hourlyTime.push(getTimeZone(new Date(element.dt * 1000), $timezone).getHours());
        $hourlyIcon.push(element['weather'][0]['icon']);
        $hourlyTemp.push(element.temp.toFixed(0));
        $hourlyRainChance.push((element['pop'] * 100).toFixed(0) + '%');
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

    $daily.forEach(element => {
        $dayOfWeek.push(getDate(getTimeZone(new Date(element.dt * 1000), $timezone)));
        $dailyIcon.push(element['weather'][0]['icon']);
        $dailyTempMax.push(element['temp']['max'].toFixed(0));
        $dailyTempMin.push(element['temp']['min'].toFixed(0));
        $dailyRainChance.push((element['pop'] * 100).toFixed(0) + '%');
    });

    // appends all the data to the corresponding element
    $city_name.append($city + '<br>' + '<span>' + $state + '</span>');
    $max.append('<img src="/images/up.png" alt = "down arrow"> ' + $tempMax + '&#176;');
    $temp.append($temperature + '&#176;');
    $min.append('<img src="/images/down.png" alt="up arrow"> ' + $tempMin + '&#176;');
    $description.append($weatherDescription);
    $icon.attr('src', 'https://openweathermap.org/img/wn/' + $weatherIcon + '@2x.png');
    $humidity.append('humidity ' + $currentHumidity + '%');
    $feels_like.append('feels like ' + $feelsLike + '&#176;');
    $wind_speed.append('wind speed ' + $windSpeed + 'mph');
    $sunrise.append('sunrise ' + $sunRise);
    $uv_index.append('uv index ' + $uvIndex + '/10');
    $sunset.append('sunset ' + $sunSet);

    $hourly_time.each((index, element) => {
        element.append($hourlyTime[index + 1]);
    });

    let index = 0;
    for (i = 1; i <= 12; i++) {
        $('.hourly-icon' + i).attr('src', 'https://openweathermap.org/img/wn/' + $hourlyIcon[index] + '@2x.png');
        index++;
    };

    $hourly_temp.each((index, element) => {
        element.append($hourlyTemp[index]);
    });
    $hourly_temp.append('&#176;');

    $hourly_rain_chance.each((index, element) => {
        element.append($hourlyRainChance[index]);
    });

    $day_of_week.each((index, element) => {
        element.append($dayOfWeek[index + 1]);
    });

    index = 0;
    for (i = 1; i <= 6; i++) {
        $('.daily-icon' + i).attr('src', 'https://openweathermap.org/img/wn/' + $dailyIcon[index] + '@2x.png');
        index++;
    };

    $daily_max.each((index, element) => {
        element.append($dailyTempMax[index]);
    });

    $daily_min.each((index, element) => {
        element.append($dailyTempMin[index]);
    });
    $('.daily-temp > p').append('&#176;');

    $daily_rain_chance.each((index, element) => {
        element.append($dailyRainChance[index]);
    });

}

let $key = 'b18a17f280f5e12915af91620df8b8c4',

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
    $hourly_icon = $('.hourly img'),
    $hourly_temp = $('.hourly-temp'),
    $hourly_rain_chance = $('.hourly-rain-chance'),

    $day_of_week = $('.day-of-week'),
    $daily_max = $('.daily-max'),
    $daily_min = $('.daily-min'),
    $daily_icon = $('.daily img'),
    $daily_rain_chance = $('.daily-rain-chance'),

    $hourlyTime = [],
    $hourlyIcon = [],
    $hourlyTemp = [],
    $hourlyRainChance = [],

    $dayOfWeek = [],
    $dailyTempMax = [],
    $dailyTempMin = [],
    $dailyIcon = [],
    $dailyRainChance = [],

    $state = '',
    $country = '',
    $city = '',
    $lat = '38.5810606',
    $lon = '-121.493895';

fetch('https://api.openweathermap.org/geo/1.0/direct?q=london&appid=' + $key)
    .then(response => response.json())
    .then(data => {
        $city = data[0]['name'];
        $country = data[0]['country'];
        $state = data[0]['state'];

        if ($country !== 'US') $state = $country;

        $lon = data[0]['lon'];
        $lat = data[0]['lat'];

        fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + $lat + '&lon=' + $lon +
            '&units=imperial&exclude=minutely,alerts&appid=' + $key)
            .then(response => response.json())
            .then(data => setData(data)) // end fetch
            .catch(err => alert(err));

    }) // end fetch
    .catch(err => alert(err));

// Changes the weather data to specified city
$submit.click(() => {
    $hourlyTime = [];
    $hourlyIcon = [];
    $hourlyTemp = [];
    $hourlyRainChance = [];

    $dayOfWeek = [];
    $dailyTempMax = [];
    $dailyTempMin = [];
    $dailyIcon = [];
    $dailyRainChance = [];

    // empties all elements
    $('.clear').empty();

    fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + $cityInput.val() + '&appid=' + $key)
        .then(response => response.json())
        .then(data => {
            $city = data[0]['name'];
            $country = data[0]['country'];
            $state = data[0]['state'];

            if ($country !== 'US') $state = $country;

            $lon = data[0]['lon'];
            $lat = data[0]['lat'];

            fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + $lat + '&lon=' + $lon +
                '&units=imperial&exclude=minutely,alerts&appid=' + $key)
                .then(response => response.json())
                .then(data => { console.log(data); setData(data) }) // end fetch
                .catch(err => alert(err));
        }) // end fetch

        .catch(() => alert('Not a city name'));
}); // end click