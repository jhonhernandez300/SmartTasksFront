import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  constructor() { }

  setToken(key: string, data: any): void {    
    sessionStorage.setItem(key, data);    
  }

  setData(key: string, data: any): void {
    sessionStorage.setItem(key, data);    
  }
  
  getData(key: string): any {   
    return sessionStorage.getItem(key);   
  }

  removeData(key: string): void {
    sessionStorage.removeItem(key);
  }

  removeAllData(): void {
    sessionStorage.clear();
  }

  isEmpty(): boolean {
    return sessionStorage.length === 0;
  }
}
