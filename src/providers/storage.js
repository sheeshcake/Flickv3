// storage.js
// Simple storage service for caching

class CacheStorageService {
  constructor() {
    this.storage = new Map();
  }

  getString(key) {
    return this.storage.get(key) || null;
  }

  setString(key, value) {
    this.storage.set(key, value);
  }

  getObject(key) {
    const value = this.storage.get(key);
    try {
      return value ? JSON.parse(value) : null;
    } catch {
      return value;
    }
  }

  setObject(key, value) {
    this.storage.set(key, typeof value === 'string' ? value : JSON.stringify(value));
  }

  removeItem(key) {
    this.storage.delete(key);
  }

  clear() {
    this.storage.clear();
  }
}

export const cacheStorageService = new CacheStorageService();