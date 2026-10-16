import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '../../../core/services/notification.service';

interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FaqItem {
  question: string;
  answer: string;
  open: boolean;
}

@Component({
  selector: 'app-contact',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule
  ],

  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {

  submitted = false;
  private fb = inject(FormBuilder);
  private notification = inject(NotificationService);
  messages: ContactFormData[] = [];
  contactForm = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[+]?[-\d\s().]{7,20}$/)]],
    subject: ['general', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });


  subjects = [
    {
      value: 'general',
      label: 'General Inquiry'
    },
    {
      value: 'vehicle',
      label: 'Vehicle Inquiry'
    },
    {
      value: 'financing',
      label: 'Financing'
    },
    {
      value: 'insurance',
      label: 'Insurance'
    },
    {
      value: 'test-drive',
      label: 'Test Drive'
    },
    {
      value: 'trade-in',
      label: 'Trade-In'
    }
  ];


  faqs: FaqItem[] = [
    {
      question:
        'How does nationwide transport delivery work?',

      answer:
        'Once your acquisition is completed and verified, we coordinate enclosed carrier transport directly to your designated address. Track links and dedicated advisor check-ins are provided daily.',

      open: true
    },

    {
      question:
        'Can I inspect the car in person before purchasing?',

      answer:
        'Absolutely. Scheduled test drives and direct viewings are available at all dealership partner locations. Schedule online or coordinate with your concierge advisor.',

      open: false
    },

    {
      question:
        'Are vehicle background checks guaranteed?',

      answer:
        'Yes. Every single listed vehicle contains verified background certifications and our bespoke 150-point report provided entirely free.',

      open: false
    },

    {
      question:
        'Do you accept trades for other luxury vehicles?',

      answer:
        'We provide virtual valuation metrics and fair value acquisition proposals for clean high-tier luxury models from selected model years.',

      open: false
    }
  ];


  sendMessage(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }
    this.messages = [...this.messages, this.contactForm.getRawValue()];
    this.submitted = true;
    this.notification.showSuccess('Your message has been sent successfully.');
    this.contactForm.reset({ subject: 'general' });
  }

  invalid(name: keyof ContactFormData): boolean {
    const control = this.contactForm.controls[name];
    return control.invalid && control.touched;
  }


  toggleFaq(index: number): void {

    this.faqs[index].open =
      !this.faqs[index].open;

  }

}
