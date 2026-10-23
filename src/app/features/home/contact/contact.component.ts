import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '../../../core/services/notification.service';

import {
  SiteContentService
} from '../../../core/services/site-content/site-content.service';


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

    phone: '',

    subject: 'general',

    message: ''

  };


  subjects: ContactSubject[] = [];

  faqs: FaqItem[] = [];


  constructor(
    private siteContentService:
      SiteContentService
  ) {}


  ngOnInit(): void {

    this.siteContentService
      .getContactContent()
      .subscribe(data => {

        this.subjects =
          data.subjects;

        this.faqs =
          data.faqs;

      });

  }

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


  toggleFaq(
    index: number
  ): void {

    this.faqs[index].open =
      !this.faqs[index].open;

  }

}
