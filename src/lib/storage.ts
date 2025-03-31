// Custom storage implementation with fallback and session storage support
interface StorageData {
  [key: string]: string;
}

class CustomStorage {
  private memoryStorage: StorageData = {};
  private useLocalStorage: boolean = false;
  private useSessionStorage: boolean = false;

  constructor() {
    this.detectStorageAvailability();
  }

  private detectStorageAvailability(): void {
    try {
      // Check if running in a restricted context
      if (typeof window === 'undefined') {
        console.warn('Running in non-browser context, using memory storage');
        return;
      }

      // Try sessionStorage first as it's more likely to be available
      if (window.sessionStorage) {
        const testKey = '__storage_test__';
        window.sessionStorage.setItem(testKey, testKey);
        window.sessionStorage.removeItem(testKey);
        this.useSessionStorage = true;
        console.log('Using sessionStorage for persistence');
      }

      // Then try localStorage if sessionStorage is not available
      if (!this.useSessionStorage && window.localStorage) {
        const testKey = '__storage_test__';
        window.localStorage.setItem(testKey, testKey);
        window.localStorage.removeItem(testKey);
        this.useLocalStorage = true;
        console.log('Using localStorage for persistence');
      }
    } catch (e) {
      console.warn('Browser storage is not available, using memory storage');
    }
  }

  getItem(key: string): string | null {
    try {
      if (this.useLocalStorage) {
        return window.localStorage.getItem(key);
      }
      if (this.useSessionStorage) {
        return window.sessionStorage.getItem(key);
      }
    } catch (error) {
      console.warn(`Error accessing storage for key ${key}, falling back to memory storage`);
    }
    return this.memoryStorage[key] || null;
  }

  setItem(key: string, value: string): void {
    try {
      if (this.useLocalStorage) {
        window.localStorage.setItem(key, value);
      } else if (this.useSessionStorage) {
        window.sessionStorage.setItem(key, value);
      }
    } catch (error) {
      console.warn(`Error writing to storage for key ${key}, using memory storage`);
    }
    // Always update memory storage as backup
    this.memoryStorage[key] = value;
  }

  removeItem(key: string): void {
    try {
      if (this.useLocalStorage) {
        window.localStorage.removeItem(key);
      } else if (this.useSessionStorage) {
        window.sessionStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error removing from storage for key ${key}`);
    }
    delete this.memoryStorage[key];
  }

  clear(): void {
    try {
      if (this.useLocalStorage) {
        window.localStorage.clear();
      } else if (this.useSessionStorage) {
        window.sessionStorage.clear();
      }
    } catch (error) {
      console.warn('Error clearing storage');
    }
    this.memoryStorage = {};
  }

  // Method to help with debugging
  getStorageType(): string {
    if (this.useLocalStorage) return 'localStorage';
    if (this.useSessionStorage) return 'sessionStorage';
    return 'memoryStorage';
  }
}

export const customStorage = new CustomStorage();
