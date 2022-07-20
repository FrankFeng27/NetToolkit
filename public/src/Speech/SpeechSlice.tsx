import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SpeechLibraryItem, SpeechLibraryTreeNode } from "../dataprovider/data-types";

const removeLibrary = createAsyncThunk(
  "speeches/removeLibrary", 
  async (lib: SpeechLibraryItem) => {
    
  }
)

interface State {
  libraries: SpeechLibraryItem[];
  currentLibraryNode?: SpeechLibraryTreeNode;
}

const initialState: State = {
  libraries: [],
  currentLibraryNode: undefined,
};

const slice = createSlice({
  name: "speeches",
  initialState,
  reducers: {
    addLibrary: (state, action: PayloadAction<SpeechLibraryItem>) => {
      state.libraries.push(action.payload);
    },
    removeLibrary: (state, action: PayloadAction<SpeechLibraryItem>) => {},
  },
  extraReducers: 
})

