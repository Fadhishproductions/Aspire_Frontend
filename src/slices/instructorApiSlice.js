import { apiSlice } from "./apiSlice";
const INTRUCTOR_URL='/api/instructor';

export const instructorApiSlice = apiSlice.injectEndpoints({
endpoints:(builder)=>({
    instructorLogin:builder.mutation({
        query:(data)=>({
         url:`${INTRUCTOR_URL}/auth`,
         method:'POST',
         body:data
        })
    }),
    instructorRegister:builder.mutation({
        query:(data)=>({
            url:`${INTRUCTOR_URL}/`,
            method:'POST',
            body:data
        })
    }),
    updateInstructor:builder.mutation({
        query:(data)=>({
            url:`${INTRUCTOR_URL}/profile`,
            method:'PUT',
            body:data
        })
    }),
    instructorLogout:builder.mutation({
        query:(data)=>({
            url:`${INTRUCTOR_URL}/logout`,
            method:"POST",
            body:data
        })
    }),
    instructorUpdate:builder.mutation({
        query:(data)=>({
            url:`${INTRUCTOR_URL}/profile`,
            method:"PUT",
            body:data
        })
    }),
    InstructorgetallCourse:builder.mutation({
        query:({id})=>({
            url:`${INTRUCTOR_URL}/${id}/courses`,
            method:"GET"
        })
    }),
   
    TogglePublishCourse:builder.mutation({
        query:({data,id})=>({
            url:`${INTRUCTOR_URL}/courses/${id}/publish`,
            method:"PUT",
            body:data
        })
    }),
    InstructorCreateCourse:builder.mutation({
        query:(data)=>({
            url:`${INTRUCTOR_URL}/courses`,
            method:"POST",
            body:data
        })
    }),
    editCourse:builder.mutation({
        query:({id,data})=>({
            url:`${INTRUCTOR_URL}/courses/${id}`,
            method: 'PUT',
            body:data
        })
    }),
    getCourse:builder.query({
        query:({id})=>({
            url:`${INTRUCTOR_URL}/courses/${id}`,
            method: 'GET', 
        })
    }),
    createSection:builder.mutation({
        query:(data)=>({
            url:`${INTRUCTOR_URL}/course/section/create`,
            method:'POST',
            body:data
        })
    }),
    getInstructorSections:builder.query({
        query:({id})=>({
            url:`${INTRUCTOR_URL}/course/${id}/sections`,
            method:'GET'
        })
    }),
    addVideoToSection:builder.mutation({
        query:({id,data})=>({
            url:`${INTRUCTOR_URL}/course/section/${id}/video`,
            method:'POST',
            body:data
        })
    }),
    editVideoToSection:builder.mutation({
        query:({sectionId,videoId,data})=>({
            url:`${INTRUCTOR_URL}/course/section/${sectionId}/video/${videoId}/edit`,
            method:'PUT',
            body:data
        })
    }),

    addQuiz:builder.mutation({
        query:({id,questions})=>({
            url:`${INTRUCTOR_URL}/course/section/${id}/quiz`,
            method:'POST',
            body:{questions}
        })
    }),
    getQuizz:builder.mutation({
        query:({id})=>({
            url:`${INTRUCTOR_URL}/course/section/${id}/quiz/questions`,
            method:"GET"
        })
    })
    ,
    addPreviewVideo:builder.mutation({
        query:({courseId,videoUrl})=>({
            url:`${INTRUCTOR_URL}/courses/${courseId}/previewvideo`,
            method:'POST',
            body:{videoUrl}
        })
    }),
    editSection:builder.mutation({
        query:({title,sectionId,courseId})=>({
            url:`${INTRUCTOR_URL}/course/${courseId}/section/${sectionId}/edit`,
            method:'PUT',
            body:{newTitle:title}
        })
    }),
    startLiveSession: builder.mutation({
        query: ({courseId}) => ({
          url: `${INTRUCTOR_URL}/course/${courseId}/live/start`,
          method: 'POST',
        }),
      }),
      stopLiveSession: builder.mutation({
        query: ({courseId}) => ({
          url: `${INTRUCTOR_URL}/course/${courseId}/live/stop`,
          method: 'POST',
        }),
      }),
      addNotification:builder.mutation({
        query:({courseId,data})=>({
            url:`${INTRUCTOR_URL}/course/${courseId}/notification/`,
            method:'POST',
            body:data
        })
      }),
      getInstructorStats: builder.query({
        query: () => `${INTRUCTOR_URL}/instructor-stats`,
      }),
      getInstructorEarnings: builder.query({
        query: ({ page, limit }) => `${INTRUCTOR_URL}/earnings?page=${page}&limit=${limit}`,
      }),
      getPurchasedCourses: builder.query({
        query: () => `${INTRUCTOR_URL}/purchased-courses`,
      }),
      getLiveToken: builder.mutation({
        query: (userId) => ({
          url: `${INTRUCTOR_URL}/generate-live-token`,   
          method: 'POST',
          body: { userId, name: 'SomeName' }, // Replace 'SomeName' with actual user data if needed
        }),
      }),
      updateCoverImage: builder.mutation({
        query: ({ courseId, imageUrl }) => ({
          url: `${INTRUCTOR_URL}/courses/${courseId}/cover-image`,
          method: 'PUT',
          body: { imageUrl },
        }),
        invalidatesTags: ['Course'], // Optional: Invalidate cache for courses
      }),
      getCategoriess: builder.query({
        query: () => ({
            url: `${INTRUCTOR_URL}/categories`,
            method: 'GET',
        })
    }),

    
})
})

export const {useInstructorLoginMutation,
              useInstructorLogoutMutation,
              useInstructorRegisterMutation,
              useUpdateInstructorMutation,
              useInstructorUpdateMutation,
              useInstructorgetallCourseMutation,
              useTogglePublishCourseMutation,
              useGetCategoriessQuery,
              useInstructorCreateCourseMutation,
              useEditCourseMutation,
              useGetCourseQuery,
              useCreateSectionMutation,
              useGetInstructorSectionsQuery,  
              useAddVideoToSectionMutation,
              useAddQuizMutation, 
              useAddPreviewVideoMutation,
              useGetQuizzMutation,
              useEditSectionMutation,
              useStartLiveSessionMutation,
              useStopLiveSessionMutation,
              useEditVideoToSectionMutation,
              useAddNotificationMutation, 
              useGetInstructorEarningsQuery,
              useGetPurchasedCoursesQuery,
              useGetLiveTokenMutation,
              useUpdateCoverImageMutation,
              useGetInstructorStatsQuery
} = instructorApiSlice 
