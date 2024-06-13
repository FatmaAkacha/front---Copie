import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../domain/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private httpClient: HttpClient) { }

  getData(): Observable<User[]> {
    return this.httpClient.get<User[]>('http://127.0.0.1:8000/api/users');
  }

  insertData(data: User): Observable<User> {
    return this.httpClient.post<User>('http://127.0.0.1:8000/api/addUser', data);
  }

  deleteData(id: string): Observable<void> {
    return this.httpClient.delete<void>('http://127.0.0.1:8000/api/deleteUser/' + id);
  }

  getUserById(id: string): Observable<User> {
    return this.httpClient.get<User>('http://127.0.0.1:8000/api/users/' + id);
  }

  updateUser(id: string, data: User): Observable<User> {
    return this.httpClient.put<User>('http://127.0.0.1:8000/api/updateUser/' + id, data);
  }
}
