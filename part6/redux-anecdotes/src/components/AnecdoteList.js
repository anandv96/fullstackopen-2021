import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { incrementVotes } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

const AnecdoteList = () => {
  const dispatch = useDispatch();

  const anecdotes = useSelector((state) => {
    let filteredAnecdotes =
      state.filter === ""
        ? state.anecdotes
        : state.anecdotes.filter((anecdote) =>
            anecdote.content.toLowerCase().includes(state.filter.toLowerCase())
          );

    return filteredAnecdotes.sort((a, b) => b.votes - a.votes);
  });

  const vote = (anecdote) => {
    dispatch(incrementVotes(anecdote));

    dispatch(setNotification(`you voted "${anecdote.content}"`));
  };

  return (
    <div>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <p>{anecdote.content}</p>
          <p>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </p>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;
