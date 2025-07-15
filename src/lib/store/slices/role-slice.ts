import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { configDataType } from "@/services/config";
import { getAllRoles } from "@/services/dashboard/roles/roles";
import { getAllRoles_Api_Response_Type } from "@/types/roles/getAllRoles.type";
import { toast } from "react-toastify";

interface ResourcesState {
  roles: getAllRoles_Api_Response_Type | null;
}

const initialState: ResourcesState = {
  roles: null,
};

export const rolesSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    setRolesData: (
      state,
      action: PayloadAction<getAllRoles_Api_Response_Type | null>
    ) => {
      state.roles = action.payload;
    },
    emptyRoles: (state) => {
      state.roles = null;
    },
  },
});

export const { setRolesData, emptyRoles } = rolesSlice.actions;

// Asynchronous thunk for fetching roles
export const fetchRoles = (config: configDataType) => async (dispatch: any) => {
  // console.log("hello");
  try {
    const response = await getAllRoles(config);
    if (response) {
      dispatch(setRolesData(response));
    }
  } catch (error: any) {
    console.error("Failed to fetch roles:", error);
    toast.error(error.message);
  }
};

export default rolesSlice.reducer;
