const notificationReducer = (state = null, action) => {
  switch (action.type) {
    case "SET_NOTIFICATION": {
      return action.data.notification;
    }
    case "CLEAR_NOTIFICATION":
      return null;
    default:
      return state;
  }
};

let timeoutID = undefined;

export const setNotification = (notification, time = 5) => {
  return async (dispatch) => {
    dispatch({
      type: "SET_NOTIFICATION",
      data: {
        notification,
      },
    });

    clearTimeout(timeoutID);
    timeoutID = setTimeout(() => dispatch(clearNotification()), time * 1000);
  };
};

export const clearNotification = () => {
  return {
    type: "CLEAR_NOTIFICATION",
  };
};

export default notificationReducer;
