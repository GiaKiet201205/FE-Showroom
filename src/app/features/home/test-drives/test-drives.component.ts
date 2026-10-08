import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

type TestDriveStatus =
  | 'upcoming'
  | 'completed'
  | 'cancelled';

interface VehicleOption {
  id: number;
  name: string;
  image: string;
  location: string;
}

interface TestDrive {
  id: number;

  vehicleId: number;
  vehicleName: string;
  vehicleImage: string;
  vehicleDescription: string;

  date: string;
  time: string;

  location: string;

  status: TestDriveStatus;
}

@Component({
  selector: 'app-test-drives',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './test-drives.component.html',
  styleUrl: './test-drives.component.scss'
})
export class TestDrivesComponent {

  // =========================
  // TAB
  // =========================

  activeTab: TestDriveStatus = 'upcoming';


  // =========================
  // SUCCESS MESSAGE
  // =========================

  showSuccess = false;


  // =========================
  // FORM
  // =========================

  fullName = '';
  email = '';
  phone = '';

  selectedVehicleId: number | null = null;

  preferredDate = '';
  preferredTime = '';


  // =========================
  // VEHICLES
  // =========================

  vehicles: VehicleOption[] = [
    {
      id: 1,
      name: 'Porsche 911 GT3 RS (2024)',
      image: '/images/detail/porsche-main.jpg',
      location: 'Beverly Hills Porsche Center, CA'
    },

    {
      id: 2,
      name: 'BMW M4 Competition (2023)',
      image: '/images/car-1.jpg',
      location: 'BMW Beverly Hills, CA'
    },

    {
      id: 3,
      name: 'Tesla Model S Plaid (2022)',
      image: '/images/car-2.jpg',
      location: 'Tesla Center Los Angeles, CA'
    },

    {
      id: 4,
      name: 'Audi RS e-tron GT (2023)',
      image: '/images/car-4.jpg',
      location: 'Audi Beverly Hills, CA'
    }
  ];


  // =========================
  // TIME SLOTS
  // =========================

  timeSlots = [
    '08:00 AM',
    '09:00 AM',
    '10:30 AM',
    '01:00 PM',
    '02:30 PM',
    '04:00 PM'
  ];


  // =========================
  // TEST DRIVE DATA
  // =========================

  testDrives: TestDrive[] = [
    {
      id: 1,

      vehicleId: 1,

      vehicleName:
        'Porsche 911 GT3 RS',

      vehicleImage:
        '/images/detail/porsche-main.jpg',

      vehicleDescription:
        'Weissach Package • GT Silver Metallic',

      date: 'October 24, 2026',

      time: '10:30 AM',

      location:
        'Beverly Hills Porsche Center, CA',

      status: 'upcoming'
    },

    {
      id: 2,

      vehicleId: 2,

      vehicleName:
        'BMW M4 Competition',

      vehicleImage:
        '/images/car-1.jpg',

      vehicleDescription:
        'Competition Package • Isle of Man Green',

      date: 'September 20, 2026',

      time: '02:30 PM',

      location:
        'BMW Beverly Hills, CA',

      status: 'completed'
    }
  ];


  constructor(
    private route: ActivatedRoute
  ) {

    const vehicleId =
      Number(
        this.route.snapshot.queryParamMap.get(
          'vehicleId'
        )
      );

    if (vehicleId) {
      this.selectedVehicleId = vehicleId;
    }

  }


  // =========================
  // FILTER BY TAB
  // =========================

  get filteredTestDrives(): TestDrive[] {

    return this.testDrives.filter(
      testDrive =>
        testDrive.status === this.activeTab
    );

  }


  // =========================
  // CHANGE TAB
  // =========================

  setTab(tab: TestDriveStatus): void {
    this.activeTab = tab;
  }


  // =========================
  // BOOK
  // =========================

  bookTestDrive(): void {

    if (
      !this.fullName ||
      !this.email ||
      !this.phone ||
      !this.selectedVehicleId ||
      !this.preferredDate ||
      !this.preferredTime
    ) {
      alert(
        'Please fill in all required information.'
      );

      return;
    }


    const vehicle =
      this.vehicles.find(
        item =>
          item.id === this.selectedVehicleId
      );


    if (!vehicle) {
      return;
    }


    const newTestDrive: TestDrive = {

      id: Date.now(),

      vehicleId: vehicle.id,

      vehicleName:
        vehicle.name.replace(
          /\s\(\d{4}\)$/,
          ''
        ),

      vehicleImage:
        vehicle.image,

      vehicleDescription:
        'Premium Vehicle',

      date:
        this.formatDate(
          this.preferredDate
        ),

      time:
        this.preferredTime,

      location:
        vehicle.location,

      status: 'upcoming'
    };


    this.testDrives = [
      newTestDrive,
      ...this.testDrives
    ];


    this.activeTab = 'upcoming';

    this.showSuccess = true;

    this.resetForm();

  }


  // =========================
  // CANCEL
  // =========================

  cancelTestDrive(id: number): void {

    const confirmed =
      confirm(
        'Are you sure you want to cancel this test drive?'
      );


    if (!confirmed) {
      return;
    }


    this.testDrives =
      this.testDrives.map(
        testDrive => {

          if (testDrive.id === id) {

            return {
              ...testDrive,
              status: 'cancelled' as TestDriveStatus
            };

          }

          return testDrive;

        }
      );

  }


  // =========================
  // DATE FORMAT
  // =========================

  private formatDate(
    value: string
  ): string {

    return new Date(
      `${value}T00:00:00`
    ).toLocaleDateString(
      'en-US',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }
    );

  }


  // =========================
  // RESET
  // =========================

  private resetForm(): void {

    this.fullName = '';
    this.email = '';
    this.phone = '';

    this.preferredDate = '';
    this.preferredTime = '';

  }

}