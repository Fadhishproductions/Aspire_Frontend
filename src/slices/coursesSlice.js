import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchTerm: '',
  filter: {
    category: '',
    level: '',
    sort: '',
  },
};

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setFilter: (state, action) => {
      state.filter = {
        ...state.filter,
        ...action.payload,
      };
    },
    clearFilters: (state) => {
      state.filter = { category: '', level: '', sort: '' };
    },
    resetSearchTerm: (state) => {
      state.searchTerm = '';
    },
  },
});

export const { setSearchTerm, setFilter, clearFilters, resetSearchTerm } = coursesSlice.actions;

export default coursesSlice.reducer;
