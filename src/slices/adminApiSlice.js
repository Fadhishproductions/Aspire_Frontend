import { apiSlice } from "./apiSlice";
const ADMIN_URL ='/api/admin';

export const adminApiSlice = apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        adminLogin:builder.mutation({
            query:(data)=>({
                url:`${ADMIN_URL}/auth`,
                method:'POST',
                body:data 
            })
        }),
        adminLogout:builder.mutation({
            query:(data)=>({
                url:`${ADMIN_URL}/logout`,
                method:'POST',
                body:data 
            })
        }),
        getAllUser: builder.mutation({
            query: ({ searchQuery, page, limit }) => ({
                url: `${ADMIN_URL}/getUserlist?search=${encodeURIComponent(searchQuery)}&page=${page}&limit=${limit}`,
                method: 'GET',
            }),
          }),
        getUser:builder.mutation({
            query:(id)=>({
                url:`${ADMIN_URL}/getUser/${id}`,
                method:'GET',
                
            })
        }), 
        blockUser:builder.mutation({
            query:({userId})=>({
                url:`${ADMIN_URL}/blockUser/${userId}`, 
                method:'PUT', 
            })
        }),
        AddCategory:builder.mutation({
            query:(data)=>({
                url:`${ADMIN_URL}/category/add`, 
                method:'POST',
                body:data 
            })
        }),
        getCategories: builder.query({
            query: () => ({
                url: `${ADMIN_URL}/category/all`,
                method: 'GET',
            })
        }),
        getCategoriesPaginated: builder.query({
            query: ({page="", limit="", search=""}) => ({
                url: `${ADMIN_URL}/category/all/paginated`,
                method: 'GET',
                params: { page, limit, search },
            })
        }),
        GetCategoryById: builder.query({
            query: ({id}) => ({
                url: `${ADMIN_URL}/category/${id}`,
                method: 'GET',
            })
        })
        ,
        editCategory:builder.mutation({
            query:({id,data})=>({
                url:`${ADMIN_URL}/category/edit/${id}`, 
                method:'POST',
                body:data 
            })
        }),
        getRevenueAnalysis: builder.query({
            query: ({ search = '', page = 1, limit = 5 }) => ({
              url: `${ADMIN_URL}/revenueAnalysis?search=${search}&page=${page}&limit=${limit}`,
              method: 'GET',
            }),
          }),
        getCourses:builder.query({
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
                  url: `${ADMIN_URL}/courses?${params.toString()}`,
                  method: 'GET',
                };
              },
        }),
        getStats:builder.query({
           query:()=>({
            url:`${ADMIN_URL}/stats`,
            method:'GET'
           }) 
        }),
        getUserGrowthData: builder.query({
            query: (groupBy) => ({
                url:`${ADMIN_URL}/user-growth?groupBy=${groupBy}`,
                method:'GET'
            })
          }),
          getPurchasedCoursesAllTime: builder.query({
            query: () => `${ADMIN_URL}/purchased-all`,
          }),
          // Fetch current month purchased courses
          getPurchasedCoursesCurrentMonth: builder.query({
            query: () => `${ADMIN_URL}/purchased-current-month`,
          }),
          getRevenueGrowth: builder.query({
            query: (granularity = 'month') => `${ADMIN_URL}/revenue-growth?granularity=${granularity}`,
          }),
          toggleCategoryPublish: builder.mutation({
            query: (categoryId) => ({
              url: `${ADMIN_URL}/category/toggle-publish/${categoryId}`,
              method: 'PUT',
            }),
          }),
         
    })
})

export const {useAdminLoginMutation,
             useAdminLogoutMutation, 
             useGetAllUserMutation,
             useBlockUserMutation, 
            useGetUserMutation,
            useGetCategoriesQuery,
            useAddCategoryMutation,
            useEditCategoryMutation,
            useGetCategoryByIdQuery,
            useGetRevenueAnalysisQuery,
            useGetCoursesQuery,
            useGetStatsQuery,
            useGetUserGrowthDataQuery,
            useGetPurchasedCoursesAllTimeQuery,
            useGetPurchasedCoursesCurrentMonthQuery,
            useGetRevenueGrowthQuery,
            useToggleCategoryPublishMutation,
            useGetCategoriesPaginatedQuery
        } = adminApiSlice