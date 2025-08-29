// src/app/services/hall.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hall } from '../models/hall.model';

@Injectable({
  providedIn: 'root'
})
export class HallService {
  private apiUrl = '/api/halls';

  constructor(private http: HttpClient) {}

  getHalls(): Observable<Hall[]> {
    return this.http.get<Hall[]>(this.apiUrl);
  }

  createHall(hall: {
    name: string;
    address: string;
    capacity: number;
    pricePerDay: number;
    description: string;
  }): Observable<Hall> {
    return this.http.post<Hall>(this.apiUrl, hall);
  }
}
