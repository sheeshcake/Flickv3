import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  myList: [],
  continueWatching: [],
  downloads: [],
}

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    getData: (state, action) => {
      state.myList = action.payload.myList
      state.continueWatching = action.payload.continueWatching
      state.downloads = action.payload.downloads
    },
    addToList: (state) => {
    },
    removeToList: (state) => {
    },
    addToContinueWatching: (state, action) => {
    },
    addToDownloads: (state, action) => {
    },
    removeToDownloads: (state, action) => {
    }
  },
})

// Action creators are generated for each case reducer function
export const { 
  addToList,
  removeToList,
  addToContinueWatching,
  addToDownloads,
  removeToDownloads
} = profileSlice.actions

export default profileSlice.reducer