import { createSlice } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-community/async-storage'


const initialState = {
  myList: [],
  continueWatching: [],
  downloads: [],
  provider: '',
  open_subtitle: {
    username: '',
    password: '',
  },
  open_subtitle_token: '',
  player_type: 'legacy',
}

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    getprofileData: (state, action) => {
      try{
        const userData = action.payload
        state.myList = userData.myList
        state.continueWatching = userData.continueWatching
        state.downloads = userData.downloads
        state.provider = userData.provider
        state.open_subtitle = userData.open_subtitle
        state.open_subtitle_token = userData.open_subtitle_token
        state.player_type = userData.player_type
      }catch(err){
        console.log(err)
      }
    },
    setProvider: (state, action) => {
      state.provider = action.payload
    },
    setOpenSubtitleToken: (state, action) => {
      state.open_subtitle_token = action.payload.token
      state.open_subtitle.username = action.payload.username
      state.open_subtitle.password = action.payload.password
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
    setPlayerType: (state, action) => {
      state.player_type = action.payload
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
  removeToDownloads,
  updateDownloads,
  setProvider,
  setOpenSubtitleToken,
  getprofileData,
  setPlayerType

} = profileSlice.actions

export default profileSlice.reducer