import { createSlice } from '@reduxjs/toolkit';

export const NO_ACTION = -1;
export const CREATE_ACTION = 1;
export const EDIT_ACTION = 2;
export const VIEW_ACTION = 3;
const initialState = {
  list: [
    {
      id:1,
      name:"Peanut",
      type:"cat",
      dob:"2023-04-27",
    }
  ],
  searchCriteria:{

  },
  loading: true,
  action: -1,
  selectIndex: -1,
  fetchKey: 0,
  token: localStorage.getItem('token') || null,
  role: null,
  userId: null,
  username: null,
  name: null
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
/*export const incrementAsync = createAsyncThunk(
  'counter/fetchCount',
  async (amount) => {
    const response = await fetchCount(amount);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);*/

export const PetSlice = createSlice({
  name: 'petStore',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    addPet: (state, action) => {
      state.list.push(action.payload);
    },
    editPet: (state, action) => {
      const pet = state.list[action.payload.selectIndex];
      pet.name = action.payload.name;
      pet.dob = action.payload.dob;
    },
    setPetList: (state, action) => {
      state.list = action.payload;
    },
    clearPetList: (state) => {
      state.list = [];
    },
    setCreate: (state) => {
      state.action = CREATE_ACTION
    },
    setEdit: (state, action) => {
      state.action = EDIT_ACTION
      state.selectIndex = action.payload
    },
    setView: (state, action) => {
      state.action = VIEW_ACTION
      state.selectIndex = action.payload
    },
    setNoAction: (state) => {
      state.action = NO_ACTION
      state.selectIndex = -1
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    updateFetchKey: (state) => {
      state.fetchKey += 1;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setUser: (state, action) => {
      state.role = action.payload.role;
      state.userId = action.payload.userId;
      state.username = action.payload.username;
      state.name = action.payload.name;
    }
  },
});

export const { addPet, setPetList, clearPetList, setCreate, setEdit, setView, setNoAction, editPet, setLoading, updateFetchKey, setToken, setUser} = PetSlice.actions;

export const getPetList = (state) => state.petStore.list;
export const getAction = (state) => state.petStore.action;
export const getSelectIndex = (state) => state.petStore.selectIndex;
export const getLoading = (state) => state.petStore.loading;
export const getFetchKey = (state) => state.petStore.fetchKey;
export const getToken = (state) => state.petStore.token;
export const getUser = (state) => {return {role:state.petStore.role, userId:state.petStore.userId, username: state.petStore.username, name:state.petStore.name}};
export default PetSlice.reducer;