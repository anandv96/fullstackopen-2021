import React from "react";

const Total = ({ course }) => {
  const total = course.parts.reduce((sum, part) => {
    return sum + part.exercises;
  }, 0);
  return <b>total of {total} exercises</b>;
};

export default Total;
