import { configureStore } from '@reduxjs/toolkit';
import PetReducer from './PetReducer';

const Store = configureStore({
  reducer: {
    catlist: PetReducer,
  },
});

export default Store;