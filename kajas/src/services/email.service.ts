import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class EmailService {
  private apiUrl = 'http://localhost:4000/api';

  constructor(private http: HttpClient) {}

  changeEmail(userId: number, currentEmail: string, newEmail: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-email`, { userId, currentEmail, newEmail, password });
  }
}
