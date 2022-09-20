import { useGetUserInfoQuery } from "@/store/api/loginApi";
import React from "react";

interface IProps {}

const Index: React.FC<IProps> = () => {
	const { data, isFetching, isSuccess } = useGetUserInfoQuery({});
	return (
		<>
			{isFetching && <div>用户信息查询中...</div>}
			{isSuccess && <div>{data.nickname}</div>}
		</>
	);
};

export default Index;
