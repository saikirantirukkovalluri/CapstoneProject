import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { Booking } from '../../models/booking.model';

@Component({
  selector: 'app-admin-bookings',
  templateUrl: './admin-bookings.component.html',
  styleUrls: ['./admin-bookings.component.css']
})
export class AdminBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  isLoading: boolean = false;
  error: string = '';

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.isLoading = true;
    this.error = '';
    console.log('Loading bookings for admin...');

    this.bookingService.getBookings().subscribe({
      next: (data: Booking[]) => {
        console.log('Bookings loaded successfully:', data);
        this.bookings = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading bookings:', err);
        this.error = 'Failed to load bookings. Please try again.';
        this.isLoading = false;
      }
    });
  }

  deleteBooking(id: number): void {
    if (confirm('Are you sure you want to delete this booking?')) {
      this.bookingService.deleteBooking(id).subscribe({
        next: () => {
          console.log('Booking deleted successfully');
          this.loadBookings(); // Reload the list
        },
        error: (err: any) => {
          console.error('Error deleting booking:', err);
          alert('Failed to delete booking. Please try again.');
        }
      });
    }
  }
}


