import { createApi } from "@reduxjs/toolkit/dist/query/react";
import axiosBaseQuery from "@/utils/request/request";

export const loginApi = createApi({
	reducerPath: "loginApi",
	baseQuery: axiosBaseQuery({
		baseUrl: "/api/"
	}),
	endpoints: build => {
		return {
			login: build.mutation({
				query: data => ({
					url: "user/login",
					method: "POST",
					data
				})
				//* transformResponse用来转换返回的数据格式
				// transformResponse: (baseQueryReturnValue: HttpResult) => baseQueryReturnValue
			}),
			getMenuList: build.query({
				query: () => ({
					url: "menu/list",
					method: "GET"
				})
			}),

			getAuthorButtons: build.query({
				query: () => ({
					url: "user/buttons",
					method: "GET"
				})
			}),

			getUserInfo: build.query({
				query: () => ({
					url: "user/info",
					method: "GET"
				})
			})
		};
	}
});

export const { useLoginMutation, useGetMenuListQuery, useGetAuthorButtonsQuery, useGetUserInfoQuery } = loginApi;
