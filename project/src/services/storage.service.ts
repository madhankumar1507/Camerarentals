import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storage: Storage;

  constructor() {
    this.storage = window.localStorage;
  }

  get<T>(key: string): T | null {
    try {
      const item = this.storage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error getting item from storage:', error);
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    try {
      this.storage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting item in storage:', error);
    }
  }

  remove(key: string): void {
    try {
      this.storage.removeItem(key);
    } catch (error) {
      console.error('Error removing item from storage:', error);
    }
  }

  clear(): void {
    try {
      this.storage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  has(key: string): boolean {
    return this.storage.getItem(key) !== null;
  }

  keys(): string[] {
    try {
      return Object.keys(this.storage);
    } catch (error) {
      console.error('Error getting storage keys:', error);
      return [];
    }
  }

  size(): number {
    try {
      return this.storage.length;
    } catch (error) {
      console.error('Error getting storage size:', error);
      return 0;
    }
  }

  // Session storage methods
  getSession<T>(key: string): T | null {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error getting item from session storage:', error);
      return null;
    }
  }

  setSession<T>(key: string, value: T): void {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting item in session storage:', error);
    }
  }

  removeSession(key: string): void {
    try {
      window.sessionStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing item from session storage:', error);
    }
  }

  clearSession(): void {
    try {
      window.sessionStorage.clear();
    } catch (error) {
      console.error('Error clearing session storage:', error);
    }
  }

  // Utility methods
  isStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      this.storage.setItem(test, test);
      this.storage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }

  getStorageSize(): number {
    try {
      let total = 0;
      for (let key in this.storage) {
        if (this.storage.hasOwnProperty(key)) {
          total += this.storage[key].length + key.length;
        }
      }
      return total;
    } catch (error) {
      console.error('Error calculating storage size:', error);
      return 0;
    }
  }

  // Encrypted storage methods (basic implementation)
  setEncrypted<T>(key: string, value: T, secretKey: string): void {
    try {
      const encrypted = this.encrypt(JSON.stringify(value), secretKey);
      this.storage.setItem(key, encrypted);
    } catch (error) {
      console.error('Error setting encrypted item:', error);
    }
  }

  getEncrypted<T>(key: string, secretKey: string): T | null {
    try {
      const encrypted = this.storage.getItem(key);
      if (!encrypted) return null;
      
      const decrypted = this.decrypt(encrypted, secretKey);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Error getting encrypted item:', error);
      return null;
    }
  }

  // Simple encryption/decryption (not suitable for production)
  private encrypt(text: string, key: string): string {
    // This is a very basic encryption - use a proper encryption library in production
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      result += String.fromCharCode(charCode);
    }
    return btoa(result);
  }

  private decrypt(encryptedText: string, key: string): string {
    // This is a very basic decryption - use a proper encryption library in production
    const text = atob(encryptedText);
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      result += String.fromCharCode(charCode);
    }
    return result;
  }

  // Backup and restore methods
  backup(): string {
    try {
      const data: { [key: string]: any } = {};
      for (let i = 0; i < this.storage.length; i++) {
        const key = this.storage.key(i);
        if (key) {
          data[key] = this.storage.getItem(key);
        }
      }
      return JSON.stringify(data);
    } catch (error) {
      console.error('Error creating backup:', error);
      return '';
    }
  }

  restore(backupData: string): void {
    try {
      const data = JSON.parse(backupData);
      this.clear();
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          this.storage.setItem(key, data[key]);
        }
      }
    } catch (error) {
      console.error('Error restoring backup:', error);
    }
  }

  // Expiring storage methods
  setWithExpiry<T>(key: string, value: T, ttl: number): void {
    try {
      const item = {
        value: value,
        expiry: Date.now() + ttl
      };
      this.storage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error('Error setting item with expiry:', error);
    }
  }

  getWithExpiry<T>(key: string): T | null {
    try {
      const itemStr = this.storage.getItem(key);
      if (!itemStr) return null;

      const item = JSON.parse(itemStr);
      if (Date.now() > item.expiry) {
        this.storage.removeItem(key);
        return null;
      }

      return item.value;
    } catch (error) {
      console.error('Error getting item with expiry:', error);
      return null;
    }
  }

  // Clean up expired items
  cleanupExpired(): void {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < this.storage.length; i++) {
        const key = this.storage.key(i);
        if (key) {
          try {
            const itemStr = this.storage.getItem(key);
            if (itemStr) {
              const item = JSON.parse(itemStr);
              if (item.expiry && Date.now() > item.expiry) {
                keysToRemove.push(key);
              }
            }
          } catch (error) {
            // Skip items that don't have expiry format
          }
        }
      }

      keysToRemove.forEach(key => {
        this.storage.removeItem(key);
      });
    } catch (error) {
      console.error('Error cleaning up expired items:', error);
    }
  }

  // Storage quota management
  getQuotaInfo(): Promise<{ used: number; total: number }> {
    return navigator.storage.estimate().then(estimate => {
      return {
        used: estimate.usage || 0,
        total: estimate.quota || 0
      };
    }).catch(error => {
      console.error('Error getting storage quota:', error);
      return { used: 0, total: 0 };
    });
  }

  // Storage events
  onStorageChange(callback: (key: string, newValue: any, oldValue: any) => void): void {
    const handler = (event: StorageEvent) => {
      if (event.key) {
        let newValue = null;
        let oldValue = null;
        
        try {
          newValue = event.newValue ? JSON.parse(event.newValue) : null;
          oldValue = event.oldValue ? JSON.parse(event.oldValue) : null;
        } catch (error) {
          newValue = event.newValue;
          oldValue = event.oldValue;
        }
        
        callback(event.key, newValue, oldValue);
      }
    };
    
    window.addEventListener('storage', handler);
  }

  // Namespaced storage
  getNamespace(namespace: string): NamespacedStorage {
    return new NamespacedStorage(this, namespace);
  }
}

class NamespacedStorage {
  constructor(private storage: StorageService, private namespace: string) {}

  private getKey(key: string): string {
    return `${this.namespace}:${key}`;
  }

  get<T>(key: string): T | null {
    return this.storage.get<T>(this.getKey(key));
  }

  set<T>(key: string, value: T): void {
    this.storage.set(this.getKey(key), value);
  }

  remove(key: string): void {
    this.storage.remove(this.getKey(key));
  }

  clear(): void {
    const keys = this.storage.keys();
    const prefix = `${this.namespace}:`;
    keys.forEach(key => {
      if (key.startsWith(prefix)) {
        this.storage.remove(key);
      }
    });
  }

  has(key: string): boolean {
    return this.storage.has(this.getKey(key));
  }

  keys(): string[] {
    const allKeys = this.storage.keys();
    const prefix = `${this.namespace}:`;
    return allKeys
      .filter(key => key.startsWith(prefix))
      .map(key => key.substring(prefix.length));
  }
}