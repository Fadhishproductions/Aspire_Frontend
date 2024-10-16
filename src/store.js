import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'
import adminauthReducer from './slices/adminAuthSlice'
import instructorauthReducer from './slices/instructorAuthslice';
import usercourseReducer from './slices/userCourseSlice'
import coursesReducer from './slices/coursesSlice'
import { apiSlice } from './slices/apiSlice';

const store = configureStore({
    reducer:{
        auth:authReducer,
        adminauth:adminauthReducer,
        instructorauth:instructorauthReducer,
        courses:coursesReducer,
        usercourse:usercourseReducer,
        [apiSlice.reducerPath]:apiSlice.reducer,
    },
middleware:(getDefaultMiddleware)=>getDefaultMiddleware().concat(apiSlice.middleware),
devTools:true
})

export default store;