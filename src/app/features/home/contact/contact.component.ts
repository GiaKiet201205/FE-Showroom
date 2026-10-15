import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
    FormsModule
  ],

  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {

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

}