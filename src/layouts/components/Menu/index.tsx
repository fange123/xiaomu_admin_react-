import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu } from "antd";
import { findAllBreadcrumb, getOpenKeys, handleRouter, searchRoute } from "@/utils/util";
import { setMenuList as reduxSetMenuList } from "@/store/slice/menuSlice";
import { setBreadcrumbList } from "@/store/slice/breadcrumbSlice";
import { setAuthRouter } from "@/store/slice/authSlice";
import { RootState, useDispatch, useSelector } from "@/store";
import type { MenuProps } from "antd";
import Logo from "./components/Logo";
import "./index.less";
import { menuRoutesData } from "@/routers";
import { RouteObject } from "@/routers/interface";

const LayoutMenu = () => {
	const dispatch = useDispatch();
	const { isCollapse, menuList: reduxMenuList } = useSelector((state: RootState) => state.reducer.menu);
	const { pathname } = useLocation();
	const [selectedKeys, setSelectedKeys] = useState<string[]>([pathname]);
	const [openKeys, setOpenKeys] = useState<string[]>([]);
	const staticRoutes = menuRoutesData[0].children!;

	// 刷新页面菜单保持高亮
	useEffect(() => {
		setSelectedKeys([pathname]);
		isCollapse ? null : setOpenKeys(getOpenKeys(pathname));
	}, [pathname, isCollapse]);

	// 设置当前展开的 subMenu
	const onOpenChange = (openKeys: string[]) => {
		if (openKeys.length === 0 || openKeys.length === 1) return setOpenKeys(openKeys);
		const latestOpenKey = openKeys[openKeys.length - 1];
		if (latestOpenKey.includes(openKeys[0])) return setOpenKeys(openKeys);
		setOpenKeys([latestOpenKey]);
	};

	// 定义 menu 类型
	type MenuItem = Required<MenuProps>["items"][number];
	const getItem = (
		label: React.ReactNode,
		key?: React.Key | null,
		icon?: React.ReactNode,
		children?: MenuItem[],
		type?: "group"
	): MenuItem => {
		return {
			key,
			icon,
			children,
			label,
			type
		} as MenuItem;
	};

	// 处理后台返回菜单 key 值为 antd 菜单需要的 key 值
	const deepLoopFloat = (staticRoutes: RouteObject[], newArr: MenuItem[] = []) => {
		staticRoutes.forEach(item => {
			// 下面判断代码解释 *** !item?.children?.length   ==>   (!item.children || item.children.length === 0)
			if (!item?.children?.length) return newArr.push(getItem(item?.meta?.title, item.path, item?.meta?.icon));
			newArr.push(getItem(item?.meta?.title, item.path, item?.meta?.icon, deepLoopFloat(item.children)));
		});
		return newArr;
	};

	// 获取菜单列表并处理成 antd menu 需要的格式
	const [menuList, setMenuList] = useState<MenuItem[]>([]);

	const getMenuData = () => {
		setMenuList(deepLoopFloat(staticRoutes));
		// 存储处理过后的所有面包屑导航栏到 redux 中
		dispatch(setBreadcrumbList(findAllBreadcrumb(staticRoutes)));

		// 把路由菜单处理成一维数组，存储到 redux 中，做菜单权限判断
		const dynamicRouter = handleRouter(staticRoutes);
		dispatch(setAuthRouter(dynamicRouter));
		dispatch(reduxSetMenuList(staticRoutes));
	};

	useEffect(() => {
		getMenuData();
	}, []);

	// 点击当前菜单跳转页面
	const navigate = useNavigate();
	const clickMenu: MenuProps["onClick"] = ({ key }: { key: string }) => {
		const route = searchRoute(key, reduxMenuList);
		if (route.isLink) window.open(route.isLink, "_blank");

		navigate(key);
	};

	return (
		<div className="menu">
			<Logo isCollapse={isCollapse}></Logo>
			<Menu
				theme="dark"
				mode="inline"
				triggerSubMenuAction="click"
				openKeys={openKeys}
				selectedKeys={selectedKeys}
				items={menuList}
				onClick={clickMenu}
				onOpenChange={onOpenChange}
			></Menu>
		</div>
	);
};

export default LayoutMenu;
