import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class UserService {
  private apiUrl = 'https://api.kajas.site/api/users';

  constructor(private http: HttpClient) {}

  getUsernames(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/usernames`);
  }

  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-email-exists?email=${email}`);
  }  

  deactivateAccount(userId: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/deactivate`, { userId, password });
  }

  reactivateAccount(userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reactivate`, { userId });
  }
}
