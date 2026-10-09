import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormsModule,
  NgForm
} from '@angular/forms';
import {
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import { FavoriteService }
  from '../../../core/services/favorite.service';


interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  location: string;
}


@Component({
  selector: 'app-profile',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterLinkActive
  ],

  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  // =========================================
  // USER
  // =========================================

  user = {
    name: 'Jonathan Vance',

    avatar: '/images/avt.jpg',

    membership:
      'Elite Member since January 2024'
  };


  // =========================================
  // FORM
  // =========================================

  profile: UserProfile = {
    fullName: 'Jonathan Vance',

    email:
      'jonathan.vance@beverlyhills.org',

    phone:
      '+1 (310) 555-8422',

    location:
      'Beverly Hills, CA'
  };


  // =========================================
  // SUCCESS MESSAGE
  // =========================================

  showSuccess = false;


  // =========================================
  // TEST DRIVE STATS
  // Sau này lấy từ TestDriveService
  // =========================================

  upcomingDrives = 1;

  completedDrives = 4;


  constructor(
    public favoriteService: FavoriteService
  ) {}


  // =========================================
  // SAVE
  // =========================================

  saveChanges(form: NgForm): void {

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }


    console.log(
      'Updated profile:',
      this.profile
    );


    // Đồng bộ tên trên header của profile
    this.user.name =
      this.profile.fullName;


    this.showSuccess = true;


    setTimeout(() => {
      this.showSuccess = false;
    }, 3000);

  }

}