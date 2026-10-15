import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ContactSubject,
  FaqItem
} from '../../../core/models/site-content.model';

import {
  SiteContentService
} from '../../../core/services/site-content/site-content.service';


@Component({
  selector: 'app-contact',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {

  submitted = false;

  contactForm = {

    fullName: '',

    email: '',

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
    if (
      !this.contactForm.fullName ||
      !this.contactForm.email ||
      !this.contactForm.phone ||
      !this.contactForm.subject ||
      !this.contactForm.message
    ) {
      return;
    }


    console.log(
      this.contactForm
    );


    this.submitted = true;


    this.contactForm = {

      fullName: '',

      email: '',

      phone: '',

      subject: 'general',

      message: ''

    };

  }


  toggleFaq(
    index: number
  ): void {

    this.faqs[index].open =
      !this.faqs[index].open;

  }
}