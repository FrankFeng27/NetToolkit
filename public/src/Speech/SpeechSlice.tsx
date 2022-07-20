import { createAsyncThunk, createEntityAdapter, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SpeechLibraryItem, SpeechLibraryTreeNode } from "../dataprovider/data-types";
import { DataAccessor } from "../dataprovider/dataprovider";

export const removeLibrary = createAsyncThunk(
  "speeches/removeLibrary", 
  async (lib: SpeechLibraryItem) => {
    const res = await DataAccessor.removeSpeechLibrary(lib.id.toString());
    return res;
  }
);
export const addLibrary = createAsyncThunk(
  "speeches/addLibrary",
  async (lib: SpeechLibraryItem) => {
    // const res = await DataAccessor.addSpeechLibrary()
    const res = await DataAccessor.addSpeechLibrary(lib.name, lib.content, lib.configuration);
    return res;
  }
);
export const getLibraries = createAsyncThunk(
  "speeches/getLibraries",
  async () => {
    const res = await DataAccessor.getSpeechLibraries();
    return res.data;
  }
)

type StatusEnum = "idle" | "loading" | "rejected" | "successed";

export interface SpeechState {
  status: StatusEnum;
  libraries: SpeechLibraryItem[];
  libraryTree?: SpeechLibraryTreeNode;
  currentLibraryNode?: SpeechLibraryTreeNode;
}

/// const adapter = createEntityAdapter();
/// const initialState = adapter.getInitialState<State>({
///   status: "idle",
///   libraries: [],
///   currentLibraryNode: undefined,
/// });
const initialState: SpeechState = {
  status: "idle",
  libraries: [],
  currentLibraryNode: undefined,
};

const slice = createSlice({
  name: "speeches",
  initialState,
  reducers: {
    setCurrentLibraryNode(state, action) {
      state.currentLibraryNode = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(removeLibrary.pending, (state, action ) => {
      state.status = "loading";
    })
    .addCase(removeLibrary.fulfilled, (state, action) => {
      state.status = "idle";
      // todo: add operation after removing lib
    })
    .addCase(removeLibrary.rejected, (state, action) => {
      state.status = "rejected";
    })
    .addCase(addLibrary.pending, (state, action) => {
      state.status = "loading";
    })
    .addCase(addLibrary.fulfilled, (state, action) => {
      state.status = "idle";
      // todo: add operations after adding lib
    })
    .addCase(getLibraries.pending, (state, action) => {
      state.status = "loading";
    })
    .addCase(getLibraries.fulfilled, (state, action) => {
      state.status = "idle";
      state.libraries = action.payload?.result ?? [];
    });
  },
});

export const  { setCurrentLibraryNode } = slice.actions;
export default slice.reducer;


