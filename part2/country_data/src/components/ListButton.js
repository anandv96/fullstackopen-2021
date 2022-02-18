import React from "react";
import Button from "./Button";

const ListButton = (props) => {
  return (
    <li>
      {props.text}{" "}
      <button onClick={() => props.handleClick(props.text)}>
        {props.buttonText}
      </button>
    </li>
  );
};

export default ListButton;
