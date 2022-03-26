/*let unix_timestamp = 1647291960;

var date = new Date(unix_timestamp * 1000);
var hours = date.getHours();
var minutes = "0" + date.getMinutes();
var seconds = "0" + date.getSeconds();

var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

console.log(formattedTime);*/



let $key = 'b18a17f280f5e12915af91620df8b8c4',
    $cityInput = $('.city-input'),
    $submit = $('.submit'),
    $name = $('.city-name'),
    $temp = $('.temp'),
    $wind = $('.wind-speed'),
    $lat = '',
    $lon = '',
    $state = '';

/*fetch('https://api.openweathermap.org/data/2.5/onecall?lat=35.9604&lon=-83.921&units=imperial&exclude=daily,current,minutely,alerts&appid=b18a17f280f5e12915af91620df8b8c4')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        var date = new Date(data['hourly'][3]['dt'] * 1000);
        console.log(date);
    })*/

$submit.click(() => {
    $name.empty();
    $temp.empty();
    $wind.empty();
    fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + $cityInput.val() + '&appid=' + $key)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            $state = data[0]['state'];
            $lon = data[0]['lon'];
            $lat = data[0]['lat'];

            fetch('https://api.openweathermap.org/data/2.5/weather?lat=' +
                $lat + '&lon=' + $lon + '&units=imperial&appid=' + $key)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    let $cityName = data['name'],
                        $cityTemp = data['main']['temp'].toFixed(0),
                        $feelsLike = data['main']['feels_like'].toFixed(0),
                        $windSpeed = data['wind']['speed'].toFixed(0);

                    $name.append($cityName + '<br>' + '<span>' + $state + '</span>');
                    $temp.append($cityTemp + '&#176;');
                    $wind.append('feels like: ' + $feelsLike + '&#176;<br>wind speed: '
                        + $windSpeed + '<span>mph</span>');

                }) // end fetch
                .catch(err => alert(err));
        }) // end fetch

        .catch(err => alert('Not a city name'));
}); // end click