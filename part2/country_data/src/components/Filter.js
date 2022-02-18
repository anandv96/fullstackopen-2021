import React from "react";
import ListButton from "./ListButton";
import Result from "./Result";

const Filter = (props) => {
  console.log(props.query.toLowerCase());

  const results =
    props.query === ""
      ? []
      : props.countries.filter((country) =>
          country.altSpellings
            .toString()
            .toLowerCase()
            .includes(props.query.toLowerCase())
        );

  if (results.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  }

  if (results.length > 1) {
    console.log("more than 1");
    return (
      <ul>
        {results.map((country) => (
          <ListButton
            key={country.name.common}
            text={country.name.common}
            buttonText="show"
            handleClick={props.handleShowButton}
          />
        ))}
      </ul>
    );
  }

  if (results.length === 1) {
    return <Result country={results[0]} />;
  }
  return <></>;
};

export default Filter;
