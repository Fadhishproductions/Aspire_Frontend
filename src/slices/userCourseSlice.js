import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  liveStreams: [],  
};

const userCourseSlice = createSlice({
  name: 'userCourse',
  initialState,
  reducers: {
    addLiveStream: (state, action) => {
      const courseId = action.payload;
      console.log('Adding live stream for course:', courseId);  // Log for debugging
      console.log("current live streams ", state.liveStreams)
      // Only add the courseId if it's not already present in liveStreams array
      if (!state.liveStreams.includes(courseId)) {
        // Create a new array instead of mutating
        state.liveStreams = [...state.liveStreams, courseId];  
        console.log('Live streams after addition:', state.liveStreams);
      }
    },
    removeLiveStream: (state, action) => {
      const courseId = action.payload;
      console.log("current live streams ", state.liveStreams)

      state.liveStreams = state.liveStreams.filter(id => id !== courseId);
    }
  }
});
export const {addLiveStream, removeLiveStream} = userCourseSlice.actions;

export default userCourseSlice.reducer;