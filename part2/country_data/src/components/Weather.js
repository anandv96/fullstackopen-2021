import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

const Weather = (props) => {
  const api_key = process.env.REACT_APP_API_KEY;
  const [weather, setWeather] = useState({});

  useEffect(() => {
    const url = `http://api.openweathermap.org/data/2.5/weather?lat=${props.country.latlng[0]}&lon=${props.country.latlng[1]}&appid=${api_key}&units=metric`;
    axios.get(url).then((response) => {
      console.log(response.data);
      setWeather(response.data);
    });
  }, []);
  if (!weather.main) {
    return <></>;
  }
  return (
    <div>
      <h1>Weather in {props.country.name.common}</h1>
      <img
        src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={`Weather icon ${weather.weather[0].description}`}
      />
      <p>temperature: {weather.main.temp} C</p>
      <p>wind: {weather.wind.speed}</p>
    </div>
  );
};

export default Weather;
