import { createAsyncThunk, createEntityAdapter, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CurrentSpeechLibrary, CurrentSpeechLibraryNodeId, SpeechLibraryItem, SpeechLibraryTreeNode, SpeechRemoveStruct, SpeechRenameStruct } from "../dataprovider/data-types";
import { DataAccessor } from "../dataprovider/dataprovider";
import * as SpeechUtils from "./SpeechUtils";

export const addLibraryAsCurrent = createAsyncThunk(
  "speeches/addLibraryAsCurrent",
  async (lib: SpeechLibraryItem, { rejectWithValue }) => {
    // const res = await DataAccessor.addSpeechLibrary()
    const result = await DataAccessor.addSpeechLibrary(lib.name, lib.content, lib.configuration);
    const curLibrary = result.data.result;
    if (Number(curLibrary.id) === NaN || Number(curLibrary.id) < 0) {
      return rejectWithValue(curLibrary.id);
    }
    const getResult = await DataAccessor.getSpeechLibraries();
    return {libraries: getResult.data.result, curLibrary};
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
export const updateCurrentLibraryContent = createAsyncThunk(
  "speeches/updateCurrentLibraryContent", 
  async(lib: SpeechLibraryItem) => {
    await DataAccessor.updateSpeechLibrary(lib.id.toString(), lib.name, lib.content, lib.configuration);
    return lib;
  }
)
export const renameCurrentLibrary = createAsyncThunk(
  "speeches/renameCurrentLibrary",
  async (renameStruct: SpeechRenameStruct): Promise<SpeechRenameStruct> => {
    if (renameStruct.library.id !== undefined) {
      const libs = renameStruct.libraries.map(lib => (lib.id === renameStruct.library.id ? {...lib, name: renameStruct.name} : {...lib}));
      const res = await DataAccessor.renameSpeechLibraries([{id: renameStruct.library.id, name: renameStruct.name}]);
      return {library: {id: renameStruct.library.id, name: renameStruct.name}, name: renameStruct.name, libraries: libs};
    }
    const length = renameStruct.name.length;
    const parentName = renameStruct.library.name;
    const libs = renameStruct.libraries.filter(v => v.name.substring(0, length) === parentName)
    .map(v => ({id: v.id, name: `${parentName}${v.name.substring(length)}`}));
    await DataAccessor.renameSpeechLibraries(libs);
    const librariesResult = await DataAccessor.getSpeechLibraries();
    const libraries = librariesResult?.data?.result;
    return {library: {...renameStruct.library, name: renameStruct.name}, ...renameStruct, libraries};
  }
);
export const removeCurrentLibrary = createAsyncThunk(
  "speeches/removeCurrentLibrary",
  async (removeStruct: SpeechRemoveStruct): Promise<SpeechRemoveStruct> => {
    const id = removeStruct.id;
    const libraries = removeStruct.libraries;
    if (id.libraryId !== undefined) {
      const numId = Number(id.libraryId);
      const res = await DataAccessor.removeSpeechLibraries([Number(id.libraryId)]);
      const libs = libraries.filter(lib => (lib.id !== numId));
      return {id, libraries: libs};
    }
    const parentName = removeStruct.id.name;
    const length = parentName.length;
    const ids = removeStruct.libraries.filter(v => v.name.substring(0, length) === parentName).map(v => (v.id));
    await DataAccessor.removeSpeechLibraries(ids);
    const libs = await DataAccessor.getSpeechLibraries();
    return {id, libraries: libs};
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
  currentSpeechLibrary?: CurrentSpeechLibrary;
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
  currentSpeechLibrary: undefined,
};

const slice = createSlice({
  name: "speeches",
  initialState,
  reducers: {
    setCurrentLibraryNode(state, action: {payload: CurrentSpeechLibrary}) {
      state.currentSpeechLibrary = { ...action.payload };
    },
  },
  extraReducers: builder => {
    builder.addCase(addLibraryAsCurrent.pending, (state, action) => {
      state.status = "loading";
    })
    .addCase(addLibraryAsCurrent.fulfilled, (state, action) => {
      state.status = "idle";
      // todo: add operations after adding lib
      state.libraries = action.payload.libraries;
      const curLib = action.payload.curLibrary;
      state.currentSpeechLibrary = {
        id: curLib.id, 
        name: curLib.name, 
        displayName: SpeechUtils.getSpeechLibaryDisplayName(curLib.name), 
        content: curLib.content, 
        configuration: curLib.configuration,
        updated: true
      };
    })
    .addCase(getLibraries.pending, (state, action) => {
      state.status = "loading";
    })
    .addCase(getLibraries.fulfilled, (state, action) => {
      state.status = "idle";
      let libraries = (action.payload?.result as SpeechLibraryItem[]) ?? [];
      libraries = SpeechUtils.sortSpeechLibraries(libraries);
      state.libraries = libraries;
    })
    .addCase(updateCurrentLibrary.pending, (state, _action) => {
      state.status = "loading";
    })
    .addCase(updateCurrentLibrary.fulfilled, (state, action) => {
      state.status = "idle";
      const lib = action.payload;
      state.currentSpeechLibrary = {id: lib.id, ...lib, displayName: SpeechUtils.getSpeechLibaryDisplayName(lib.name)};
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
      state.currentSpeechLibrary = {...state.currentSpeechLibrary, content: lib.content, configuration: lib.configuration};
    })
    .addCase(getLibraryForCurLibraryNode.rejected, (state, _action) => {
      state.status = "rejected";
    })
    .addCase(renameCurrentLibrary.pending, (state, _action) => {
      state.status = "loading"
    })
    .addCase(renameCurrentLibrary.fulfilled, (state, action) => {
      state.status = "idle";
      const renameStruct = action.payload;
      state.currentSpeechLibrary = renameStruct.library;
      const libraries = SpeechUtils.sortSpeechLibraries(renameStruct.libraries);
      state.libraries = libraries;
    })
    .addCase(removeCurrentLibrary.pending, (state, _action) => {
      state.status = "loading";
    })
    .addCase(removeCurrentLibrary.fulfilled, (state, action) => {
      state.status = "idle";
      state.currentSpeechLibrary = undefined;
      const removeStruct = action.payload;
      const libraries = SpeechUtils.sortSpeechLibraries(removeStruct.libraries);
      state.libraries = removeStruct.libraries;
    })
    .addCase(updateCurrentLibraryContent.pending, (state, _action) => {
      state.status = "loading";
    })
    .addCase(updateCurrentLibraryContent.fulfilled, (state, _action) => {
      state.status = "idle";
    });
  },
});

export const  { setCurrentLibraryNode } = slice.actions;
export default slice.reducer;


