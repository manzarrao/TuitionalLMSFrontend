import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Curriculum_Type,
  Board_Type,
  Subject_Type,
  Grade_Type,
  ResourceGetAll_ApiResponse_Type,
} from "@/services/dashboard/superAdmin/resources/resource.type";
import { AxiosGet } from "@/utils/helpers/api-methods";
import { resourcesApi } from "@/api/resources";
import { configDataType } from "@/services/config";

interface ResourcesState {
  board: Board_Type[] | null;
  grades: Grade_Type[] | null;
  subject: Subject_Type[] | null;
  curriculum: Curriculum_Type[] | null;
}

const initialState: ResourcesState = {
  board: null,
  grades: null,
  subject: null,
  curriculum: null,
};

export const resourcesSlice = createSlice({
  name: "resources",
  initialState,
  reducers: {
    setResourcesData: (state, action: PayloadAction<ResourcesState>) => {
      state.board = action.payload.board;
      state.grades = action.payload.grades;
      state.subject = action.payload.subject;
      state.curriculum = action.payload.curriculum;
    },
    emptyResources: (state) => {
      state.board = null;
      state.grades = null;
      state.subject = null;
      state.curriculum = null;
    },
  },
});

export const { setResourcesData, emptyResources } = resourcesSlice.actions;

export default resourcesSlice.reducer;

// Asynchronous thunk for fetching resources
export const fetchResources =
  (config: configDataType) => async (dispatch: any) => {
    const response = await AxiosGet<ResourceGetAll_ApiResponse_Type>(
      resourcesApi(),
      config
    );
    if (response) {
      dispatch(
        resourcesSlice.actions.setResourcesData({
          board: response?.board,
          grades: response?.grades,
          subject: response?.subject,
          curriculum: response?.curriculum,
        })
      );
    }
  };
