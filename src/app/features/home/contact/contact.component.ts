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

  submitted = false;


  contactForm: ContactFormData = {
    fullName: '',
    email: '',
    phone: '',
    subject: 'general',
    message: ''
  };


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
      'Contact form:',
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


  toggleFaq(index: number): void {

    this.faqs[index].open =
      !this.faqs[index].open;

  }

}