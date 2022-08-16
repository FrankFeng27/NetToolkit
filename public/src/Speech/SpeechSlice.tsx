import { createAsyncThunk, createEntityAdapter, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CurrentSpeechLibraryNodeId, SpeechLibraryItem, SpeechLibraryTreeNode } from "../dataprovider/data-types";
import { DataAccessor } from "../dataprovider/dataprovider";
import * as SpeechUtils from "./SpeechUtils";

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
);
export const updateCurrentLibrary = createAsyncThunk(
  "speeches/updateCurrentLibrary",
  async(lib: SpeechLibraryItem) => {
    await DataAccessor.updateSpeechLibrary(lib.id.toString(), lib.name, lib.content, lib.configuration);
    return lib;
  }
);
export const getLibraryForCurLibraryNode = createAsyncThunk(
  "speeches/getLibrary",
  async (id: string) => {
    const res = await DataAccessor.getSpeechLibrary(id);
    return res.data;
  }
);


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
    })
    .addCase(updateCurrentLibrary.pending, (state, _action) => {
      state.status = "loading";
    })
    .addCase(updateCurrentLibrary.fulfilled, (state, action) => {
      state.status = "idle";
      const lib = action.payload;
      state.currentLibraryNode = {libraryId: lib.id.toString(), ...lib, displayName: getSpeechLibaryDisplayName(lib.name)};
    })
    .addCase(updateCurrentLibrary.rejected, (state, _action) => {
      state.status = "rejected";
    })
    .addCase(getLibraryForCurLibraryNode.pending, (state, _action) => {
      state.status = "loading";
    })
    .addCase(getLibraryForCurLibraryNode.fulfilled, (state, action) => {
      state.status = "idle";
      const lib = action.payload.result;
      state.currentLibraryNode = {...state.currentLibraryNode, content: lib.content, configuration: lib.configuration};
    })
    .addCase(getLibraryForCurLibraryNode.rejected, (state, _action) => {
      state.status = "rejected";
    });
  },
});

export const  { setCurrentLibraryNode } = slice.actions;
export default slice.reducer;


