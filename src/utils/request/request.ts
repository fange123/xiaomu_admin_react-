import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import axios, { AxiosResponse } from "axios";
import type { AxiosRequestConfig, AxiosError } from "axios";
import { localGet } from "@/utils/util";
import NProgress from "@/config/nprogress";
import { AxiosCanceler } from "./helper/axiosCancel";
import { showFullScreenLoading, tryHideFullScreenLoading } from "@/config/serviceLoading";
import { store } from "@/store";
import { ResultEnum } from "@/enums/httpEnum";
import { setToken } from "@/store/slice/globalSlice";
import { message } from "antd";
import { checkStatus } from "./helper/checkStatus";

const configState = {
	// 默认地址请求地址，可在 .env 开头文件中修改
	baseURL: import.meta.env.VITE_API_URL as string,
	// 设置超时时间（10s）
	timeout: 10000,
	// 跨域时候允许携带凭证
	withCredentials: true
};
//* 请求白名单：不需要添加token
const whiteList = ["/hooks/login"];
const axiosCanceler = new AxiosCanceler();

const request = axios.create(configState);
/**
 * @description 请求拦截器
 * 客户端发送请求 -> [请求拦截器] -> 服务器
 * token校验(JWT) : 接受服务器返回的token,存储到redux/本地储存当中
 */
request.interceptors.request.use(
	(config: AxiosRequestConfig) => {
		NProgress.start();
		// * 将当前请求添加到 pending 中
		axiosCanceler.addPending(config);
		// * 如果当前请求不需要显示 loading,在api服务中通过指定的第三个参数: { headers: { noLoading: true } }来控制不显示loading，参见loginApi
		config.headers!.noLoading || showFullScreenLoading();
		const token: string = localGet("token");
		//* 通过白名单判断请求是否携带token
		if (whiteList.includes(config.url!)) {
			return config;
		}

		return { ...config, headers: { ...config.headers, "x-access-token": token } };
	},
	(error: AxiosError) => {
		return Promise.reject(error);
	}
);

/**
 * @description 响应拦截器
 *  服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
 */
request.interceptors.response.use(
	(response: AxiosResponse) => {
		const { data, config } = response;
		NProgress.done();
		// * 在请求结束后，移除本次请求(关闭loading)
		axiosCanceler.removePending(config);
		tryHideFullScreenLoading();
		// * 登录失效（code == 599）
		if (data.code == ResultEnum.OVERDUE) {
			store.dispatch(setToken(""));
			message.error(data.msg);
			window.location.hash = "/login";
			return Promise.reject(data);
		}
		// * 全局错误信息拦截（防止下载文件得时候返回数据流，没有code，直接报错）
		if (data.code && data.code !== ResultEnum.SUCCESS) {
			message.error(data.msg);
			return Promise.reject(data);
		}
		// * 成功请求（在页面上除非特殊情况，否则不用处理失败逻辑）
		return data;
	},
	async (error: AxiosError) => {
		const { response } = error;
		NProgress.done();
		tryHideFullScreenLoading();
		// 请求超时单独判断，请求超时没有 response
		if (error.message.indexOf("timeout") !== -1) message.error("请求超时，请稍后再试");
		// 根据响应的错误状态码，做不同的处理
		if (response) checkStatus(response.status);
		// 服务器结果都没有返回(可能服务器错误可能客户端断网) 断网处理:可以跳转到断网页面
		if (!window.navigator.onLine) window.location.hash = "/500";
		return Promise.reject(error);
	}
);

const axiosBaseQuery =
	(
		{ baseUrl }: { baseUrl: string } = { baseUrl: "" }
	): BaseQueryFn<{
		url: string;
		method: AxiosRequestConfig["method"];
		data?: AxiosRequestConfig["data"];
		params?: AxiosRequestConfig["params"];
	}> =>
	({ url, method, data, params }) =>
		request({ url: baseUrl + url, method, data, params });
export default axiosBaseQuery;
