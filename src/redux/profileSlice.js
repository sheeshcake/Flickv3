import { createSlice } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-community/async-storage'


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
    addToDownloads: async (state, action) => {
      state.downloads.push(action.payload)
      await AsyncStorage.setItem("userProfile", JSON.stringify(state))
    },
    updateDownloads: async (state, action) => {
      const index = state.downloads.findIndex(data => data.id === action.payload.id)
      state.downloads[index] = action.payload
      await AsyncStorage.setItem("userProfile", JSON.stringify(state))
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