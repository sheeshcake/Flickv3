import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    movies: [],
    popular_movie: [],
    horror_movie: [],
    action_movie: [],
    comedy_movie: [],
    romance_movie: [],
    tv_show: [],
}

export const homeSliice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setMovies: (state, action) => {
        state.movies = action.payload
    },
    setPopularMovie: (state, action) => {
        state.popular_movie = action.payload
    },
    setHorrorMovie: (state, action) => {
        state.horror_movie = action.payload
    },
    setActionMovie: (state, action) => {
        state.action_movie = action.payload
    },
    setComedyMovie: (state, action) => {
        state.comedy_movie = action.payload
    },
    setRomanceMovie: (state, action) => {
        state.romance_movie = action.payload
    },
    setTvShow: (state, action) => {
        state.tv_show = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { 
    setMovies,
    setPopularMovie,
    setHorrorMovie,
    setActionMovie,
    setComedyMovie,
    setRomanceMovie,
    setTvShow
} = homeSliice.actions

export default homeSliice.reducer