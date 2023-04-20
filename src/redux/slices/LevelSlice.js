import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: 1,
};

export const levelSlice = createSlice({
    name: 'level',
    initialState,
    reducers: {
        increment: (state) => {
            state.value += 1;
        }
    },
});

export const { increment } = levelSlice.actions;

export default levelSlice.reducer;