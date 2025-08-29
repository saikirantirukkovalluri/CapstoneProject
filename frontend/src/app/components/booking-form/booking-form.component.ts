import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { Booking } from '../../models/booking.model';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css']
})
export class BookingFormComponent implements OnInit {
  customerName: string = '';
  startDate: string = '';
  endDate: string = '';
  selectedHallId: number = 0;
  isLoading: boolean = false;

  constructor(
    private bookingService: BookingService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.selectedHallId = idParam ? Number(idParam) : 0;
  }

  bookHall(): void {
    // Validation
    if (!this.customerName.trim()) {
      alert('Please enter customer name');
      return;
    }
    if (!this.startDate) {
      alert('Please select start date');
      return;
    }
    if (!this.endDate) {
      alert('Please select end date');
      return;
    }
    if (new Date(this.startDate) >= new Date(this.endDate)) {
      alert('End date must be after start date');
      return;
    }

    this.isLoading = true;
    console.log('Starting booking process...');

    const booking: Booking = {
      hall: { id: this.selectedHallId },
      customerName: this.customerName.trim(),
      startDate: this.startDate,
      endDate: this.endDate,
      status: 'CONFIRMED'
    };

    console.log('Booking data to send:', booking);

    this.bookingService.bookHall(booking).subscribe({
      next: (response: Booking) => {
        console.log('Booking success', response);
        alert('Booking successful!');
        this.router.navigate(['/halls']);
      },
      error: (error: any) => {
        console.error('Booking error details:', error);
        let errorMessage = 'Booking failed!';
        
        if (error.message) {
          errorMessage = error.message;
        } else if (error.status === 409) {
          errorMessage = 'Selected dates are already booked. Please choose different dates.';
        } else if (error.status === 400) {
          errorMessage = 'Invalid booking data. Please check your input.';
        } else if (error.error && typeof error.error === 'string') {
          errorMessage = error.error;
        }
        
        console.error('Final error message:', errorMessage);
        alert(errorMessage);
      },
      complete: () => {
        this.isLoading = false;
        console.log('Booking request completed');
      }
    });
  }
}
