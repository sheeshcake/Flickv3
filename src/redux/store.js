import { configureStore } from '@reduxjs/toolkit'

import profileReducer from '~/redux/profileSlice'
import homeReducer from '~/redux/homeSlice'

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    home: homeReducer,
  },
})