const inputEl = document.getElementById("input-el");
const button = document.getElementById("button");
const weatherInfo = document.getElementById("weather-info");
const apikey = "c2c6571bc27749f0924f8446e4a76f14";// Your Api key


//input city suggestions

const suggestions = document.getElementById('suggestions');
let debounceTimer;

inputEl.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  const query = inputEl.value.trim();

  if (query.length < 2) {
    suggestions.innerHTML = '';
    return;
  }

  debounceTimer = setTimeout(() => {
    fetchSuggestions(query);
  }, 300);
});

async function fetchSuggestions(query) {
  try {
    const res = await fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${query}&limit=10`, {
      method: 'GET',
      headers: {

        'X-RapidAPI-Key':"ee92c989c9mshb8c3d886185df6bp1dec88jsn91a4273ca7d9",// your api key
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
      }
    });

    const data = await res.json();

    // Filter to more relevant results
    const filtered = data.data.filter(city => city.name.toLowerCase().startsWith(query.toLowerCase()));

    suggestions.innerHTML = filtered.length
      ? filtered.map(city => `<li onclick="selectCity('${city.name}')">${city.name}, ${city.countryCode}</li>`).join('')
      : '<li>No matching cities found</li>';

  } catch (error) {
    console.error('Error fetching city suggestions:', error);
    suggestions.innerHTML = '<li>Error loading suggestions</li>';
  }
 
}

function selectCity(cityName) {
  inputEl.value = cityName;
  suggestions.innerHTML = '';
}
// Unified function to handle input and fetch
function content() {
    const city = inputEl.value.trim();
    if (city) {
        weatherInfo.textContent = "Loading...";
        weather(city);
        inputEl.value = "";
    } else {
        weatherInfo.textContent = "Please enter a city name.";
    }
}

// Event listener for button click
button.addEventListener("click", content);

// Event listener for "Enter" key
document.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        content();
    }
});

// Async function to fetch and show weather
async function weather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        
        if (data.cod !== 200) {
            weatherInfo.textContent = "City not found. Please try again.";
            return;
        }
        
        // Display weather data
        const weatherDescription = `${city}: ${data.main.temp}°C, ${data.weather[0].description}`;
        weatherInfo.textContent = weatherDescription;

        // Update background and add emoji based on weather
        updateBackground(data.weather[0].main,data.dt >= data.sys.sunrise && data.dt < data.sys.sunset);
        console.log(data.dt)
        
        // Add the emoji to the displayed text content
        const emoji = getEmoji(data.weather[0].main,data.dt >= data.sys.sunrise && data.dt < data.sys.sunset);
        weatherInfo.textContent += ` ${emoji}`;
    } catch (error) {
        weatherInfo.textContent = "Error fetching weather data.please try agin leater";
        console.error("Error:", error);
    }
}

// Function to update the background based on the weather condition
function updateBackground(weatherCondition ,dayOrNight) {
    let gradient = '';
    let backgroundImage = '';


    switch (true) {
        case weatherCondition.toLowerCase() ==='clear' && dayOrNight ===true:
            gradient = "linear-gradient(to right, #ff7e5f, #feb47b)"; // Warm sunny gradient
            backgroundImage = './image/clear-weather.jpeg';
            break;
            case weatherCondition.toLowerCase() ==='clear' && dayOrNight ===false:
            gradient = "linear-gradient(to right,rgb(44, 109, 161),rgb(28, 42, 99))"; // Warm night gradient
            backgroundImage = './image/n-clear.jpg';
            break;
            case weatherCondition.toLowerCase() ==='clouds' && dayOrNight ===true:
            gradient = "linear-gradient(to right, #b3cde0, #f0f4f8)"; // Light cloudy gradient
            backgroundImage = './image/cloud-weather.jpeg';
            break;
            case weatherCondition.toLowerCase() ==='clouds' && dayOrNight ===false:
            gradient = "linear-gradient(to right, #b3cde0,rgb(1, 3, 5))"; // Light cloudy gradient
            backgroundImage = './image/n-cloud.jpeg';
            break;
           
        case  weatherCondition.toLowerCase() === 'rain'  && dayOrNight ===true:
            gradient = "linear-gradient(to right, #4ca1af, #c4e0e5)"; // Rainy gradient
            backgroundImage = './image/rain-weather.jpg';
            break;
        case  weatherCondition.toLowerCase() === 'rain'&& dayOrNight === false:
            gradient = "linear-gradient(to right, #4ca1af,rgb(103, 106, 107))"; // Rainy gradient
            backgroundImage = './image/n-rain.jpg';
            break;
        case  weatherCondition.toLowerCase() === 'snow' && dayOrNight ===true:
            gradient = "linear-gradient(to right, #7f8c8d, #ecf0f1)"; // Snowy gradient
            backgroundImage = './image/snow-weather.jpeg';
            break;
        case  weatherCondition.toLowerCase() === 'snow' && dayOrNight ===false:
            gradient = "linear-gradient(to right,rgb(178, 184, 184), #ecf0f1)"; // Snowy gradient
            backgroundImage = './image/n-snow.jpeg';
            break;
        case  weatherCondition.toLowerCase() === 'thunderstorm' && dayOrNight ===true:
            gradient = "linear-gradient(to right, #555,rgb(45, 83, 121))"; // Thunderstorm gradient
            backgroundImage = './image/thunder-weather.jpeg';
            break;
        case  weatherCondition.toLowerCase() === 'thunderstorm'  && dayOrNight ===false:
            gradient = "linear-gradient(to right, #555, #2c3e50)"; // Thunderstorm gradient
            backgroundImage = './image/n-thunder.jpeg';
            break;
        case  weatherCondition.toLowerCase() === 'drizzle' && dayOrNight ===true:
            gradient = "linear-gradient(to right, #a1c4fd, #c2e9fb)"; // Drizzle gradient
            backgroundImage = './image/drizzle-weather.jpg';
            break;
        case  weatherCondition.toLowerCase() === 'drizzle' && dayOrNight ===false:
            gradient = "linear-gradient(to right,rgb(77, 96, 126), #c2e9fb)"; // Drizzle gradient
            backgroundImage = './image/n-drizzle.jpeg';
            break;
        default:
            gradient = "linear-gradient(to right, #74ebd5, #ACB6E5)"; // Default gradient
            backgroundImage = './image/defalut-weather.jpeg';
            break;
    }
    // Apply the gradient and background image to the body
    document.body.style.backgroundImage = `url(${backgroundImage}), ${gradient}`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed"; // For parallax effect
}


// Function to return the emoji for the weather
function getEmoji(weatherCondition,dayOrNight) {
    let emoji = '';
    switch (true) {
        case weatherCondition.toLowerCase() ==='clear' && dayOrNight ===true:
            emoji = "🌞"; // Sun emoji for clear weather
            break;
            case weatherCondition.toLowerCase() ==='clear' && dayOrNight ===false:
            emoji = "🌙"; // Sun emoji for clear weather
            break;
        case weatherCondition.toLowerCase() === 'clouds'&& dayOrNight ===true:
            emoji = "⛅"; // Cloud emoji for cloudy weather
            break;
        case weatherCondition.toLowerCase() === 'clouds' && dayOrNight ===false:
            emoji = "☁️"; // Cloud emoji for cloudy weather
            break;
        case weatherCondition.toLowerCase() === 'rain'&& dayOrNight ===true:
            emoji = "🌦"; // Rain emoji
            break;
        case weatherCondition.toLowerCase() === 'rain'&& dayOrNight ===false:
            emoji = "🌧️"; // Rain emoji
            break;
        case weatherCondition.toLowerCase() === 'snow'&& dayOrNight ===true:
            emoji = "❄️"; // Snowflake emoji
            break;
        case weatherCondition.toLowerCase() === 'snow'&& dayOrNight ===false:
            emoji = "❄️"; // Snowflake emoji
            break;
        case weatherCondition.toLowerCase() === 'thunderstorm':
            emoji = "⚡"; // Thunderstorm emoji
            break;
        case weatherCondition.toLowerCase() === 'drizzle':
            emoji = "🌦️"; // Drizzle emoji
            break;
        default:
            emoji = "🌞"; // Default sun emoji
            break;
    }
    return emoji;
}
window.selectCity = selectCity;
