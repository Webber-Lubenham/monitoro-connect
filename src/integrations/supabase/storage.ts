
/**
 * Cross-browser storage implementation with error handling
 */
export class CustomStorageAPI {
  private memoryStorage = new Map<string, string>();
  private localStorageAvailable: boolean;
  private sessionStorageAvailable: boolean;
  private useSessionStorage: boolean;

  constructor(useSessionStorage = false) {
    this.localStorageAvailable = this.checkLocalStorageAvailable();
    this.sessionStorageAvailable = this.checkSessionStorageAvailable();
    this.useSessionStorage = useSessionStorage;
    
    console.log(useSessionStorage ? 'Using sessionStorage for persistence' : 'Using localStorage for persistence');
  }

  private checkLocalStorageAvailable(): boolean {
    try {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        console.info('Window or localStorage not available, using memory storage');
        return false;
      }
      
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      console.info('localStorage not available or permission denied, using memory storage instead');
      return false;
    }
  }

  private checkSessionStorageAvailable(): boolean {
    try {
      if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') {
        console.info('Window or sessionStorage not available, using memory storage');
        return false;
      }
      
      const testKey = '__storage_test__';
      sessionStorage.setItem(testKey, testKey);
      sessionStorage.removeItem(testKey);
      return true;
    } catch (e) {
      console.info('sessionStorage not available or permission denied, using memory storage instead');
      return false;
    }
  }

  getItem(key: string): string | null {
    try {
      if (this.useSessionStorage && this.sessionStorageAvailable) {
        return sessionStorage.getItem(key);
      } else if (this.localStorageAvailable) {
        return localStorage.getItem(key);
      } else {
        return this.memoryStorage.get(key) || null;
      }
    } catch (error) {
      console.warn('Error accessing storage:', error);
      return this.memoryStorage.get(key) || null;
    }
  }

  setItem(key: string, value: string): void {
    try {
      // Always store in memory for failover
      this.memoryStorage.set(key, value);
      
      // Try browser storage if available
      if (this.useSessionStorage && this.sessionStorageAvailable) {
        sessionStorage.setItem(key, value);
      } else if (this.localStorageAvailable) {
        localStorage.setItem(key, value);
      }
    } catch (error) {
      console.warn('Error setting storage item:', error);
    }
  }

  removeItem(key: string): void {
    try {
      this.memoryStorage.delete(key);
      if (this.useSessionStorage && this.sessionStorageAvailable) {
        sessionStorage.removeItem(key);
      } else if (this.localStorageAvailable) {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn('Error removing storage item:', error);
    }
  }
}
