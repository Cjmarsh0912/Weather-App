/*let unix_timestamp = 647184023

var date = new Date(unix_timestamp * 1000);
var hours = date.getHours();
var minutes = "0" + date.getMinutes();
var seconds = "0" + date.getSeconds();

var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

console.log(formattedTime);
https://api.openweathermap.org/data/2.5/weather?lat=35.9603948&lon=-83.9210261&units=imperial&appid=b18a17f280f5e12915af91620df8b8c4
*/
let $key = 'b18a17f280f5e12915af91620df8b8c4',
    $city = $('.city'),
    $submit = $('.submit'),
    $name = $('.name'),
    $wind = $('.wind'),
    $temp = $('.temp');

$submit.click(() => {
    fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + $city.val() + '&appid=' + $key).then(response => response.json()).then(data => {
        console.log(data);
        fetch('https://api.openweathermap.org/data/2.5/weather?lat=' +
            data[0]['lat'] + '&lon=' + data[0]['lon'] + '&units=imperial&appid=' + $key)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                let $cityTemp = data['main']['temp'];
                let $windSpeed = data['wind']['speed'];
                let $cityName = data['name'];

                $name.text($cityName);
                $wind.text($windSpeed);
                $temp.text($cityTemp);


            }) // end fetch

            .catch(err => alert(err));
    }) // end fetch

        .catch(err => alert('Not a city name'));
}); // end click