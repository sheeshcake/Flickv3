import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // Array of {id, title, type, poster, progress, duration, lastWatched, seasonNumber, episodeNumber}
};

export const continueWatchingSlice = createSlice({
  name: 'continueWatching',
  initialState,
  reducers: {
    addOrUpdateItem: (state, action) => {
      const {
        id,
        title,
        type,
        poster,
        progress,
        duration,
        seasonNumber,
        episodeNumber,
        episodeTitle,
        overview,
      } = action.payload;

      // Find existing item
      const existingIndex = state.items.findIndex(item => {
        if (type === 'tv') {
          return item.id === id && 
                 item.seasonNumber === seasonNumber && 
                 item.episodeNumber === episodeNumber;
        }
        return item.id === id;
      });

      const watchItem = {
        id,
        title,
        type,
        poster,
        progress,
        duration,
        lastWatched: Date.now(),
        seasonNumber: seasonNumber || null,
        episodeNumber: episodeNumber || null,
        episodeTitle: episodeTitle || null,
        overview: overview || null,
      };

      if (existingIndex !== -1) {
        // Update existing item
        state.items[existingIndex] = watchItem;
      } else {
        // Add new item at the beginning
        state.items.unshift(watchItem);
      }

      // Keep only the last 20 items
      if (state.items.length > 20) {
        state.items = state.items.slice(0, 20);
      }
    },
    
    removeItem: (state, action) => {
      const { id, seasonNumber, episodeNumber, type } = action.payload;
      
      state.items = state.items.filter(item => {
        if (type === 'tv') {
          return !(item.id === id && 
                   item.seasonNumber === seasonNumber && 
                   item.episodeNumber === episodeNumber);
        }
        return item.id !== id;
      });
    },
    
    loadItems: (state, action) => {
      state.items = action.payload || [];
    },
    
    clearAll: (state) => {
      state.items = [];
    },
  },
});

export const { 
  addOrUpdateItem, 
  removeItem, 
  loadItems, 
  clearAll 
} = continueWatchingSlice.actions;

export default continueWatchingSlice.reducer;
