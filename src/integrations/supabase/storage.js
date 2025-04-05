"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomStorageAPI = void 0;
/**
 * Cross-browser storage implementation with error handling
 */
var CustomStorageAPI = /** @class */ (function () {
    function CustomStorageAPI(useSessionStorage) {
        if (useSessionStorage === void 0) { useSessionStorage = false; }
        this.memoryStorage = new Map();
        this.localStorageAvailable = this.checkLocalStorageAvailable();
        this.sessionStorageAvailable = this.checkSessionStorageAvailable();
        this.useSessionStorage = useSessionStorage;
        console.log(useSessionStorage ? 'Using sessionStorage for persistence' : 'Using localStorage for persistence');
    }
    CustomStorageAPI.prototype.checkLocalStorageAvailable = function () {
        try {
            if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
                console.info('Window or localStorage not available, using memory storage');
                return false;
            }
            var testKey = '__storage_test__';
            localStorage.setItem(testKey, testKey);
            localStorage.removeItem(testKey);
            return true;
        }
        catch (e) {
            console.info('localStorage not available or permission denied, using memory storage instead');
            return false;
        }
    };
    CustomStorageAPI.prototype.checkSessionStorageAvailable = function () {
        try {
            if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') {
                console.info('Window or sessionStorage not available, using memory storage');
                return false;
            }
            var testKey = '__storage_test__';
            sessionStorage.setItem(testKey, testKey);
            sessionStorage.removeItem(testKey);
            return true;
        }
        catch (e) {
            console.info('sessionStorage not available or permission denied, using memory storage instead');
            return false;
        }
    };
    CustomStorageAPI.prototype.getItem = function (key) {
        try {
            if (this.useSessionStorage && this.sessionStorageAvailable) {
                return sessionStorage.getItem(key);
            }
            else if (this.localStorageAvailable) {
                return localStorage.getItem(key);
            }
            else {
                return this.memoryStorage.get(key) || null;
            }
        }
        catch (error) {
            console.warn('Error accessing storage:', error);
            return this.memoryStorage.get(key) || null;
        }
    };
    CustomStorageAPI.prototype.setItem = function (key, value) {
        try {
            // Always store in memory for failover
            this.memoryStorage.set(key, value);
            // Try browser storage if available
            if (this.useSessionStorage && this.sessionStorageAvailable) {
                sessionStorage.setItem(key, value);
            }
            else if (this.localStorageAvailable) {
                localStorage.setItem(key, value);
            }
        }
        catch (error) {
            console.warn('Error setting storage item:', error);
        }
    };
    CustomStorageAPI.prototype.removeItem = function (key) {
        try {
            this.memoryStorage.delete(key);
            if (this.useSessionStorage && this.sessionStorageAvailable) {
                sessionStorage.removeItem(key);
            }
            else if (this.localStorageAvailable) {
                localStorage.removeItem(key);
            }
        }
        catch (error) {
            console.warn('Error removing storage item:', error);
        }
    };
    return CustomStorageAPI;
}());
exports.CustomStorageAPI = CustomStorageAPI;
