import { AuthState } from "@/store/interface";
import { localSet } from "@/utils/util";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const authState: AuthState = {
	authButtons: {},
	authRouter: []
};

const authSlice = createSlice({
	name: "auth",
	initialState: authState,
	reducers: {
		setAuthButtons(state: AuthState, { payload }: PayloadAction<{ [propName: string]: any }>) {
			state.authButtons = payload;
		},
		setAuthRouter(state: AuthState, { payload }: PayloadAction<string[]>) {
			state.authRouter = payload;
			localSet("authRouter", JSON.stringify(state.authRouter));
		}
	}
});

export const { setAuthButtons, setAuthRouter } = authSlice.actions;
export default authSlice.reducer;
