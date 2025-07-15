import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User_Type, SignIn_Response_Type } from "@/services/auth/auth.types";

export interface UserState {
  token: string;
  user: User_Type | null;
  enrollementIds?: number[];
  childrens?: number[];
}

const initialState: UserState = {
  token: "",
  user: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<SignIn_Response_Type>) => {
      state.token = action.payload.token;
      state.user = { ...action.payload.user };

      if (action.payload.enrollementIds) {
        state.enrollementIds = [...action.payload.enrollementIds];
      }
      if (action.payload.childrens) {
        state.childrens = [...action.payload.childrens];
      }
    },
    setUserSyncing: (state, action: PayloadAction<{ isSync: boolean }>) => {
      if (state.user) {
        state.user.isSync = action.payload.isSync;
      }
    },
    emptyUserData: (state) => {
      state.token = "";
      state.user = null;
      delete state.enrollementIds;
      delete state.childrens;
    },
  },
});

export const { setUserData, emptyUserData, setUserSyncing } = userSlice.actions;

export default userSlice.reducer;
