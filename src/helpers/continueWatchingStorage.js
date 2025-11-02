import AsyncStorage from '@react-native-community/async-storage';

const CONTINUE_WATCHING_KEY = '@continue_watching';

export const continueWatchingStorage = {
  // Save continue watching data
  async save(items) {
    try {
      await AsyncStorage.setItem(CONTINUE_WATCHING_KEY, JSON.stringify(items));
      return true;
    } catch (error) {
      console.error('Error saving continue watching data:', error);
      return false;
    }
  },

  // Load continue watching data
  async load() {
    try {
      const data = await AsyncStorage.getItem(CONTINUE_WATCHING_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading continue watching data:', error);
      return [];
    }
  },

  // Clear all continue watching data
  async clear() {
    try {
      await AsyncStorage.removeItem(CONTINUE_WATCHING_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing continue watching data:', error);
      return false;
    }
  },

  // Remove a specific item
  async removeItem(id, seasonNumber = null, episodeNumber = null, type = 'movie') {
    try {
      const items = await this.load();
      const filteredItems = items.filter(item => {
        if (type === 'tv') {
          return !(item.id === id && 
                   item.seasonNumber === seasonNumber && 
                   item.episodeNumber === episodeNumber);
        }
        return item.id !== id;
      });
      await this.save(filteredItems);
      return true;
    } catch (error) {
      console.error('Error removing continue watching item:', error);
      return false;
    }
  },
};
