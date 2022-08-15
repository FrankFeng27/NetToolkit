import { createSlice } from "@reduxjs/toolkit";
import { LogInTypeEnum } from "../dataprovider/data-types";

export interface LoginState {
  loginDlgType: LogInTypeEnum;
}

const initialState: LoginState = {
  loginDlgType: LogInTypeEnum.Hide
};

const slice = createSlice({
  name: "login",
  initialState,
  reducers: {
    openLoginDialog(state, action) {
      state.loginDlgType = action.payload;
    }
  }
});

export const { openLoginDialog } = slice.actions;
export default slice.reducer;
