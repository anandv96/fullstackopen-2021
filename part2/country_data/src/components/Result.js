import React from "react";
import Weather from "./Weather";

const Result = (props) => {
  return (
    <div>
      <h1>{props.country.name.common}</h1>
      <p>capital {props.country.capital} </p>
      <p>area {props.country.area}</p>
      <b>languages:</b>
      <ul>
        {Object.keys(props.country.languages).map((language) => (
          <li key={language}>{props.country.languages[language]}</li>
        ))}
      </ul>
      <img
        src={props.country.flags.png}
        alt={`Flag of ${props.country.name.common}`}
        width="100"
      />

      <Weather country={props.country} />
    </div>
  );
};

export default Result;
