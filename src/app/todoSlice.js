import { createSlice } from "@reduxjs/toolkit";




const todoSlice = createSlice({
    name: 'todoList',
    initialState:
        []
    , reducers: {
        addMission: (state, action) => {
            state.push(action.payload);
        },
        deleteMission: (state, action) => {
            return state.filter(mission => mission.id !== action.payload);
        },
        updateCountDown: (state, action) => {
            const { id, time } = action.payload;
            const targer = state.find(mission => mission.id === id);
            if (targer) {
                targer.countDown = time;
            }
        },
        removeCountDown: (state, action) => {
            const target = state.find(mission => mission.id === action.payload);
            if (target) {
                target.countDown = null;
            }
        },
        toggleComplete: (state, action) => {
            const target = state.find(mission => mission.id === action.payload);
            if (target) {
                target.completed = !target.completed;
            }
        }
    }
});

export default todoSlice;