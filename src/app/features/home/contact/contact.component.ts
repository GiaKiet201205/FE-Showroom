import { CommonModule } from '@angular/common';

import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  ContactSubject,
  FaqItem
} from '../../../core/models/site-content.model';

import {
  NotificationService
} from '../../../core/services/notification.service';

import {
  SiteContentService
} from '../../../core/services/site-content/site-content.service';


// =====================================================
// FORM MODEL
// =====================================================

interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
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
export class ContactComponent
  implements OnInit {

  // =====================================================
  // DEPENDENCY INJECTION
  // =====================================================

  private fb =
    inject(FormBuilder);

  private notification =
    inject(NotificationService);


  // =====================================================
  // STATE
  // =====================================================

  submitted = false;

  messages: ContactFormData[] = [];


  // =====================================================
  // REACTIVE FORM
  // =====================================================

  contactForm =
    this.fb.nonNullable.group({

      fullName: [
        '',
        [
          Validators.required,
          Validators.minLength(2)
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^[+]?[-\d\s().]{7,20}$/
          )
        ]
      ],

      subject: [
        'general',
        Validators.required
      ],

      message: [
        '',
        [
          Validators.required,
          Validators.minLength(10)
        ]
      ]

    });


  // =====================================================
  // MOCK CONTENT
  // =====================================================

  subjects: ContactSubject[] = [];

  faqs: FaqItem[] = [];


  constructor(
    private siteContentService:
      SiteContentService
  ) {}


  // =====================================================
  // INIT
  // =====================================================

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


  // =====================================================
  // SEND MESSAGE
  // =====================================================

  sendMessage(): void {

    if (
      this.contactForm.invalid
    ) {

      this.contactForm
        .markAllAsTouched();

      return;

    }


    const message =
      this.contactForm
        .getRawValue();


    this.messages = [
      ...this.messages,
      message
    ];


    this.submitted = true;


    this.notification
      .showSuccess(
        'Your message has been sent successfully.'
      );


    this.contactForm.reset({
      fullName: '',
      email: '',
      phone: '',
      subject: 'general',
      message: ''
    });

  }


  // =====================================================
  // VALIDATION
  // =====================================================

  invalid(
    name: keyof ContactFormData
  ): boolean {

    const control =
      this.contactForm
        .controls[name];


    return (
      control.invalid &&
      control.touched
    );

  }


  // =====================================================
  // FAQ
  // =====================================================

  toggleFaq(
    index: number
  ): void {

    this.faqs[index].open =
      !this.faqs[index].open;

  }

}