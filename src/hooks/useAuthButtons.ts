import { searchRoute } from "@/utils/util";
import { useLocation } from "react-router-dom";
import { menuRoutesData } from "@/routers";
import { RootState, useSelector } from "@/store";

/**
 * @description 页面按钮权限 hooks
 * */
const useAuthButtons = () => {
	const { authButtons } = useSelector((state: RootState) => state.reducer.auth);
	const { pathname } = useLocation();
	const route = searchRoute(pathname, menuRoutesData);

	return {
		BUTTONS: authButtons[route.meta!.key!] || {}
	};
};

export default useAuthButtons;
