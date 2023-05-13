import { configureStore } from '@reduxjs/toolkit';
import PetReducer from './PetReducer';

const Store = configureStore({
  reducer: {
    petStore: PetReducer,
  },
});

export default Store;