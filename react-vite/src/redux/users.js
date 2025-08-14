// Action types
const SET_USERS = 'users/setUsers';
const SET_SINGLE_USER = 'users/setSingleUser';
const CLEAR_USERS = 'users/clearUsers';

// Action creators
const setUsers = (users) => ({
  type: SET_USERS,
  payload: users
});

const setSingleUser = (user) => ({
  type: SET_SINGLE_USER,
  payload: user
});

export const clearUsers = () => ({
  type: CLEAR_USERS
});

// Thunks
export const thunkGetUsers = () => async (dispatch) => {
  const response = await fetch("/api/users");

  if (response.ok) {
    const data = await response.json();
    if (data.errors) return;
    dispatch(setUsers(data.users));
  }
};

export const thunkGetUserById = (id) => async (dispatch) => {
  const response = await fetch(`/api/users/${id}`);

  if (response.ok) {
    const data = await response.json();
    if (data.errors) return;
    dispatch(setSingleUser(data));
  }
};

// Initial state
const initialState = {
  list: [],
  single: null
};

// Reducer
export default function usersReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USERS:
      return { ...state, list: action.payload };
    case SET_SINGLE_USER:
      return { ...state, single: action.payload };
    case CLEAR_USERS:
      return { ...state, list: [], single: null };
    default:
      return state;
  }
}
