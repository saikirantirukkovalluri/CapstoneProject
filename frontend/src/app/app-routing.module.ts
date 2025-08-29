import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HallListComponent } from './components/hall-list/hall-list.component';
import { BookingFormComponent } from './components/booking-form/booking-form.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminBookingsComponent } from './components/admin-bookings/admin-bookings.component';
import { UserGuard } from './guards/user.guard';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },

  // User area
  { path: 'user', component: UserDashboardComponent, canActivate: [UserGuard] },
  { path: 'halls', component: HallListComponent, canActivate: [UserGuard] },
  { path: 'book/:id', component: BookingFormComponent, canActivate: [UserGuard] },

  // Admin area with child routes
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', redirectTo: 'bookings', pathMatch: 'full' },
      { path: 'bookings', component: AdminBookingsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
