import anecdoteService from "../services/anecdotes";

const getId = () => (100000 * Math.random()).toFixed(0);

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0,
  };
};

const initialState = [].map(asObject);

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const anecdote = await anecdoteService.create(content);
    dispatch({
      type: "CREATE",
      anecdote,
    });
  };
};

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch({ type: "INIT", data: anecdotes });
  };
};

export const incrementVotes = (anecdote) => {
  return async (dispatch) => {
    await anecdoteService.update({ ...anecdote, votes: anecdote.votes + 1 });
    dispatch({
      type: "VOTE",
      data: anecdote.id,
    });
  };
};

const anecdoteReducer = (state = initialState, action) => {
  switch (action.type) {
    case "VOTE": {
      return state.map((anecdote) =>
        anecdote.id === action.data
          ? { ...anecdote, votes: anecdote.votes + 1 }
          : anecdote
      );
    }
    case "CREATE":
      return state.concat(action.anecdote);
    case "INIT":
      return action.data;
    default:
      return state;
  }
};

export default anecdoteReducer;
