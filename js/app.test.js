function getTimeZone(time, timezone) {
  let localTime = time.getTime(),
    localOffset = time.getTimezoneOffset() * 60000,
    utc = localTime + localOffset,
    newDate = utc + timezone * 1000;
  newDate = new Date(newDate);
  return newDate;
}

function getTime(time) {
  let $hourlyTime = time.getHours(),
    $min = time.getMinutes();

  if ($min < 10) $min = '0' + $min.toString();

  switch (true) {
    case $hourlyTime === 0:
      $hourlyTime = 12;
      $min += 'am';
      break;
    case $hourlyTime === 12:
      $min += 'pm';
      break;
    case $hourlyTime < 12:
      $min += 'am';
      break;
    default:
      $hourlyTime -= 12;
      $min += 'pm';
  }
  time = $hourlyTime.toString() + ':' + $min;
  return time;
}

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

test('Should get the military time of 23', () => {
  expect(getTimeZone(new Date(1678058557 * 1000), 0).getHours()).toEqual(23);
});

test('Should equal a time of 11:22pm', () => {
  expect(getTime(getTimeZone(new Date(1678058557 * 1000), 0))).toEqual(
    '11:22pm'
  );
});

test('Should equal a date of Sun 5', () => {
  expect(getDate(getTimeZone(new Date(1678058557 * 1000), 0))).toEqual('Sun 5');
});
