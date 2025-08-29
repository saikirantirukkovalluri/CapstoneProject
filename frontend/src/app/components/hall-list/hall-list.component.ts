import { Component, OnInit } from '@angular/core';
import { HallService } from '../../services/hall.service';
import { BookingService } from '../../services/booking.service';
import { Hall } from '../../models/hall.model';
import { Booking } from '../../models/booking.model';

@Component({
  selector: 'app-hall-list',
  templateUrl: './hall-list.component.html',
  styleUrls: ['./hall-list.component.css']
})
export class HallListComponent implements OnInit {
  halls: Hall[] = [];
  bookingForms: { [hallId: number]: { customerName: string; startDate: string; endDate: string } } = {};
  loadingBookings: { [hallId: number]: boolean } = {};

  constructor(private hallService: HallService, private bookingService: BookingService) {}

  ngOnInit(): void {
    this.hallService.getHalls().subscribe({
      next: (data) => {
        this.halls = data;
        // Initialize booking forms for each hall
        this.halls.forEach(hall => {
          this.bookingForms[hall.id] = { customerName: '', startDate: '', endDate: '' };
          this.loadingBookings[hall.id] = false;
        });
      },
      error: (err: any) => {
        console.error('Error loading halls', err);
        // Fallback to sample data if API fails
        this.halls = this.getSampleHalls();
        this.halls.forEach(hall => {
          this.bookingForms[hall.id] = { customerName: '', startDate: '', endDate: '' };
          this.loadingBookings[hall.id] = false;
        });
      }
    });
  }

  book(hallId: number): void {
    const form = this.bookingForms[hallId];
    
    // Validation
    if (!form.customerName.trim()) {
      alert('Please enter customer name');
      return;
    }
    if (!form.startDate) {
      alert('Please select start date');
      return;
    }
    if (!form.endDate) {
      alert('Please select end date');
      return;
    }
    if (new Date(form.startDate) >= new Date(form.endDate)) {
      alert('End date must be after start date');
      return;
    }

    this.loadingBookings[hallId] = true;
    console.log('Starting booking process for hall:', hallId);

    const booking: Booking = {
      hall: { id: hallId },
      customerName: form.customerName.trim(),
      startDate: form.startDate,
      endDate: form.endDate,
      status: 'CONFIRMED'
    };

    console.log('Booking data to send:', booking);

    this.bookingService.bookHall(booking).subscribe({
      next: (response: Booking) => {
        console.log('Booking success', response);
        alert('Booking successful!');
        // Reset form
        this.bookingForms[hallId] = { customerName: '', startDate: '', endDate: '' };
      },
      error: (err: any) => {
        console.error('Booking error details:', err);
        let errorMessage = 'Booking failed!';
        
        if (err.message) {
          errorMessage = err.message;
        } else if (err.status === 409) {
          errorMessage = 'Selected dates are already booked. Please choose different dates.';
        } else if (err.status === 400) {
          errorMessage = 'Invalid booking data. Please check your input.';
        } else if (err.error && typeof err.error === 'string') {
          errorMessage = err.error;
        } else if (err.status === 0) {
          errorMessage = 'Unable to connect to server. Please check if the backend is running.';
        }
        
        console.error('Final error message:', errorMessage);
        alert(errorMessage);
      },
      complete: () => {
        this.loadingBookings[hallId] = false;
        console.log('Booking request completed');
      }
    });
  }

  private getSampleHalls(): Hall[] {
    return [
      {
        id: 1,
        name: 'Grand Palace Hall',
        address: '123 Main Street, City Center',
        capacity: 500,
        pricePerDay: 5000,
        description: 'Luxurious hall with modern amenities'
      },
      {
        id: 2,
        name: 'Royal Garden Hall',
        address: '456 Park Avenue, Downtown',
        capacity: 300,
        pricePerDay: 3500,
        description: 'Beautiful garden hall with outdoor space'
      }
    ];
  }
}
