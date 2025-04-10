// //import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiFog } from 'react-icons/wi';

// const WeatherWidget = () => {
//   const [weather, setWeather] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   useEffect(() => {
//     const fetchWeather = async () => {
//       try {
//         setLoading(true);
//         // Using a free API key - you should replace this with your own for production
//         const response = await axios.get(
//           `https://api.openweathermap.org/data/2.5/weather?q=Colombo&units=metric&appid=8d2de98e089f1c28e1a22fc19a24ef04`
//         );
//         setWeather(response.data);
//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching weather data:', err);
//         setError('Failed to load weather');
//         setLoading(false);
//       }
//     };

//     fetchWeather();
    
//     // Refresh weather data every 30 minutes
//     const intervalId = setInterval(fetchWeather, 30 * 60 * 1000);
    
//     return () => clearInterval(intervalId);
//   }, []);

//   const getWeatherIcon = (weatherId) => {
//     if (weatherId >= 200 && weatherId < 300) return <WiThunderstorm />;
//     if (weatherId >= 300 && weatherId < 600) return <WiRain />;
//     if (weatherId >= 600 && weatherId < 700) return <WiSnow />;
//     if (weatherId >= 700 && weatherId < 800) return <WiFog />;
//     if (weatherId === 800) return <WiDaySunny />;
//     if (weatherId > 800) return <WiCloudy />;
//     return <WiDaySunny />;
//   };

//   if (loading) {
//     return (
//       <div className="weather-widget">
//         <span>Loading weather...</span>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="weather-widget">
//         <span>Weather unavailable</span>
//       </div>
//     );
//   }

//   if (!weather) {
//     return null;
//   }

//   return (
//     <div className="weather-widget">
//       <div className="weather-icon">
//         {getWeatherIcon(weather.weather[0].id)}
//       </div>
//       <div className="weather-info">
//         <span className="temperature">{Math.round(weather.main.temp)}°C</span>
//         <span className="location">{weather.name}</span>
//       </div>
//     </div>
//   );
// };

// export default WeatherWidget;