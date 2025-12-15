import { configureStore } from '@reduxjs/toolkit';
import todoSlice from './todoSlice';

const loadMission = () => {
  const data = localStorage.getItem('CDMissionList');
  return data ? JSON.parse(data) : []
}

const store = configureStore({
  reducer: {
    todoList: todoSlice.reducer,
  },
  preloadedState: {
    todoList: loadMission(),
  }
});

export default store;