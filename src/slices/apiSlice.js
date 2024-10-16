import {createApi , fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import config from '../config';
const baseQuery = fetchBaseQuery({baseUrl: config.domain, // Your API base URL
    credentials: 'include',  
    });

export const apiSlice = createApi({
    baseQuery,
    tagTypes:['User','Admin','Instructor'],
    endpoints:(builder)=>({}),
})  