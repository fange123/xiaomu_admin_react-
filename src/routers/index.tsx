import { Navigate, useRoutes } from "react-router-dom";
import { RouteObject } from "@/routers/interface";
import Login from "@/views/login/index";
import lazyLoad from "./utils/lazyLoad";
import React from "react";
import { LayoutIndex } from "./constant";
import { SmileOutlined, SettingOutlined, SkinOutlined, SendOutlined } from "@ant-design/icons";

export const menuRoutesData: RouteObject[] = [
	{
		path: "/",
		element: <LayoutIndex />,
		children: [
			{
				path: "/home",
				roles: ["admin", "test"],
				element: lazyLoad(React.lazy(() => import("@/views/home"))),
				meta: {
					title: "首页",
					icon: <SmileOutlined />,
					requiresAuth: true
				}
			},
			{
				path: "/user/info",
				roles: ["admin", "test"],
				element: lazyLoad(React.lazy(() => import("@/views/userInfo"))),
				meta: {
					title: "用户信息",
					icon: <SmileOutlined />,
					requiresAuth: true
				}
			},
			{
				path: "/assembly",
				meta: {
					title: "常用组件",
					icon: <SettingOutlined />,
					requiresAuth: true
				},
				children: [
					{
						path: "/assembly/selectIcon",
						element: lazyLoad(React.lazy(() => import("@/views/assembly/selectIcon/index"))),
						meta: {
							title: "Icon 选择",
							icon: <SkinOutlined />,
							requiresAuth: true
						}
					},
					{
						path: "/assembly/batchImport",
						element: lazyLoad(React.lazy(() => import("@/views/assembly/batchImport/index"))),
						meta: {
							requiresAuth: true,
							title: "批量导入数据",
							icon: <SendOutlined />
						}
					}
				]
			},
			{
				path: "/menu",
				meta: {
					title: "菜单",
					icon: <SettingOutlined />,
					requiresAuth: true
				},
				children: [
					{
						path: "/menu/menu1",
						element: lazyLoad(React.lazy(() => import("@/views/menu/menu1"))),
						meta: {
							title: "菜单1",
							icon: <SkinOutlined />,
							requiresAuth: true
						}
					},
					{
						path: "/menu/menu2",
						meta: {
							title: "菜单2",
							icon: <SkinOutlined />,
							requiresAuth: true
						},
						children: [
							{
								path: "/menu/menu2/menu21",
								element: lazyLoad(React.lazy(() => import("@/views/menu/menu2/menu21"))),
								meta: {
									title: "菜单21",
									icon: <SkinOutlined />,
									requiresAuth: true
								}
							},
							{
								path: "/menu/menu2/menu22",
								meta: {
									title: "菜单22",
									icon: <SkinOutlined />,
									requiresAuth: true
								},
								children: [
									{
										path: "/menu/menu2/menu22/menu221",
										element: lazyLoad(React.lazy(() => import("@/views/menu/menu2/menu22/menu221"))),
										meta: {
											title: "菜单221",
											icon: <SkinOutlined />,
											requiresAuth: true
										}
									}
								]
							}
						]
					}
				]
			}
		]
	}
];
export const rootRouter: RouteObject[] = [
	{
		path: "/",
		element: <Navigate to="/login" />
	},
	{
		path: "/login",
		element: <Login />,
		meta: {
			requiresAuth: false,
			title: "登录页"
		}
	},
	...menuRoutesData,
	{
		path: "/403",
		element: lazyLoad(React.lazy(() => import("@/components/ErrorMessage/403"))),
		meta: {
			requiresAuth: true,
			title: "403页面"
		}
	},
	{
		path: "/404",
		element: lazyLoad(React.lazy(() => import("@/components/ErrorMessage/404"))),
		meta: {
			requiresAuth: false,
			title: "404页面"
		}
	},
	{
		path: "/500",
		element: lazyLoad(React.lazy(() => import("@/components/ErrorMessage/500"))),
		meta: {
			requiresAuth: false,
			title: "500页面"
		}
	},
	{
		path: "*",
		element: <Navigate to="/404" />
	}
];

const Router = () => {
	const routes = useRoutes(rootRouter);
	return routes;
};

export default Router;
