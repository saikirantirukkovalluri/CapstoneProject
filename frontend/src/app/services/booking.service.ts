import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Booking } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private baseUrl = '/api/bookings';

  constructor(private http: HttpClient) {}

  createBooking(booking: Booking): Observable<Booking> {
    console.log('Sending booking request:', booking);
    console.log('Request URL:', this.baseUrl);
    
    return this.http.post<Booking>(this.baseUrl, booking).pipe(
      tap(response => console.log('Booking response:', response)),
      catchError(this.handleError)
    );
  }

  // Alias for backward compatibility
  bookHall(booking: Booking): Observable<Booking> {
    return this.createBooking(booking);
  }

  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.baseUrl).pipe(
      catchError(this.handleError)
    );
  }

  getBookingById(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  deleteBooking(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('HTTP Error:', error);
    console.error('Error status:', error.status);
    console.error('Error message:', error.message);
    console.error('Error details:', error.error);
    
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 0) {
        errorMessage = 'Unable to connect to server. Please check if the backend is running.';
      } else if (error.status === 404) {
        errorMessage = 'API endpoint not found. Please check the backend configuration.';
      } else if (error.status === 500) {
        // Check for Hibernate lazy loading issue
        if (error.error && error.error.message && 
            error.error.message.includes('ByteBuddyInterceptor') || 
            error.error.message.includes('hibernateLazyInitializer')) {
          errorMessage = 'Backend configuration issue: Hibernate lazy loading problem. Please contact the administrator.';
        } else {
          errorMessage = 'Server error. Please try again later.';
        }
      } else if (error.error && typeof error.error === 'string') {
        errorMessage = error.error;
      } else {
        errorMessage = `Server Error: ${error.status} - ${error.message}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
