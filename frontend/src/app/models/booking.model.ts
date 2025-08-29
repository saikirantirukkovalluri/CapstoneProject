export interface Booking {
  id?: number;
  hall: {
    id: number;
  };
  customerName: string;
  startDate: string; // Will be converted to LocalDate on backend
  endDate: string;   // Will be converted to LocalDate on backend
  status?: string;
}
