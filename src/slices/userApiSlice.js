import { apiSlice } from "./apiSlice"; 
const USERS_URL = '/api/users';

export const usersApiAlice = apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        login:builder.mutation({
            query:(data)=>({
                url:`${USERS_URL}/auth`,
                method:'POST',
                body:data
            })
        }),
        register:builder.mutation({
            query:(data)=>({
                url:`${USERS_URL}`,
                method:'POST',
                body:data
            })
        }),
        updateUser:builder.mutation({
            query:(data)=>({
                url:`${USERS_URL}/profile`,
                method:'PUT',
                body:data
            })
        }),
        logout: builder.mutation({
            query:(data)=>({
                url:`${USERS_URL}/logout`,
                method:'POST',
                body:data
            })
        }),
        getCourses: builder.query({
            query: ({ searchTerm = '', category = '', level = '', sort = '', page = 1, limit = 10 }) => {
              // Construct query parameters
              const params = new URLSearchParams();
          
              if (searchTerm) params.append('search', searchTerm);
              if (category) params.append('category', category);
              if (level) params.append('level', level);
              if (sort) params.append('sort', sort);
              if (page) params.append('page', page);
              if (limit) params.append('limit', limit);
          
              return {
                url: `${USERS_URL}/courses?${params.toString()}`,
                method: 'GET',
              };
            },
          }),
          getcategories: builder.mutation({
            query: () => ({
               url:`${USERS_URL}/courses/category/all`, 
               method: 'GET',
            })
          }),
          getCourse:builder.query({
            query:({id})=>({
                url:`${USERS_URL}/courses/${id}`,
                method: 'GET', 
            })
        }),
        createPaymentSession:builder.mutation({
            query:(data)=>({
                url:`${USERS_URL}/create-checkout-session`,
                method:'POST',
                body:data
            })
        }),
        getEnrolledCourses:builder.query({
            query:({ searchTerm = '', page = 1, limit = 10 })=>({
                url:`${USERS_URL}/enrolled`,
                method:'GET',
                params: { searchTerm, page, limit },
            })
        }),
        getSections:builder.query({
            query:({id})=>({
                url:`${USERS_URL}/course/${id}/sections`,
                method:'GET',
                credentials:'include'
            })
        }), 
        forgotPassword:builder.mutation({
            query:(data)=>({
                url:`${USERS_URL}/forgotpassword`,
                method:`POST`,
                body:data
            })
        }),
        resetPassword:builder.mutation({
            query:({ token, password })=>({
                url:`${USERS_URL}/resetpassword/${token}`,
                method:'POST',
                body:{password}
            })
        }),
        getQuiz:builder.query({
            query:({id})=>({
                url:`${USERS_URL}/course/section/${id}/quiz/questions`,
                method:'GET'
            })
        }),
        getNofications:builder.query({
            query:()=>({
                url:`${USERS_URL}/notifications`,
                method:'GET'
            })
        }),
        deleteNotification:builder.mutation({
            query:({notificationId})=>({
                url:`${USERS_URL}/notifications/${notificationId}/delete`, 
                method:'POST', 
            })
        }),
        updateVideoProgress:builder.mutation({
            query:(data)=>({
                url:`${USERS_URL}/progress/update`,
                method:'POST',
                body:data
            })
        }),
        getVideoProgress:builder.mutation({
            query:({courseId,sectionId,videoId})=>({
                url:`${USERS_URL}/progress/${courseId}/${sectionId}/${videoId}`,
                method:'GET',
            })
        }),
        getSuggestions:builder.query({
            query:(searchTerm)=>({
                url:`${USERS_URL}/suggestions`,
                params: { search: searchTerm },
                method:'GET',
            })
        }),
        getCourseProgress: builder.query({
            query: (courseId) => `${USERS_URL}/courses/${courseId}/progress`,
          }),
          getLiveToken: builder.mutation({
            query: (userId) => ({
              url: `${USERS_URL}/generate-live-token`,   
              method: 'POST',
              body: { userId, name: 'SomeName' }, // Replace 'SomeName' with actual user data if needed
            }),
          }),
      
    })
})

export const {useLoginMutation,useLogoutMutation,useRegisterMutation,useUpdateUserMutation,
     useGetCoursesQuery,useGetcategoriesMutation,useGetCourseQuery,useCreatePaymentSessionMutation,
    useGetEnrolledCoursesQuery,useGetSectionsQuery, useForgotPasswordMutation,
    useResetPasswordMutation,useGetQuizQuery,useGetNoficationsQuery,useDeleteNotificationMutation,
    useUpdateVideoProgressMutation,useGetVideoProgressMutation,useGetSuggestionsQuery,
    useGetCourseProgressQuery, useGetLiveTokenMutation
      
} = usersApiAlice