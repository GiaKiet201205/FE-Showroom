import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import { FavoriteService }
  from '../../../core/services/favorite.service';
import { NotificationService } from '../../../core/services/notification.service';


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
    ReactiveFormsModule,
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

  private readonly initialProfile: UserProfile = {
    fullName: 'Jonathan Vance',
    email: 'jonathan.vance@beverlyhills.org',
    phone: '+1 (310) 555-8422',
    location: 'Beverly Hills, CA'
  };
  private notification = inject(NotificationService);
  savedProfiles: UserProfile[] = [{ ...this.initialProfile }];
  profileForm = inject(FormBuilder).nonNullable.group({
    fullName: [this.initialProfile.fullName, [Validators.required, Validators.minLength(2)]],
    email: [this.initialProfile.email, [Validators.required, Validators.email]],
    phone: [this.initialProfile.phone, [Validators.required, Validators.pattern(/^[+]?[-\d\s().]{7,20}$/)]],
    location: [this.initialProfile.location, [Validators.required, Validators.minLength(2)]]
  });


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

  saveChanges(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    const profile = this.profileForm.getRawValue();
    this.savedProfiles = [...this.savedProfiles, profile];
    this.user.name = profile.fullName;
    this.showSuccess = true;
    this.notification.showSuccess('Your profile has been updated successfully.');
    setTimeout(() => {
      this.showSuccess = false;
    }, 3000);

  }

  invalid(name: keyof UserProfile): boolean {
    const control = this.profileForm.controls[name];
    return control.invalid && control.touched;
  }

}
