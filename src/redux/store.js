import { configureStore } from '@reduxjs/toolkit'

import profileReducer from '~/redux/profileSlice'
import homeReducer from '~/redux/homeSlice'
import continueWatchingReducer from '~/redux/continueWatchingSlice'

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    home: homeReducer,
    continueWatching: continueWatchingReducer,
  },
})