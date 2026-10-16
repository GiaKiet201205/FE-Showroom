import { Injectable } from '@angular/core';

import {
  Observable,
  of
} from 'rxjs';

import {
  AboutContent,
  ContactContent,
  HomeContent,
  PremiumService
} from '../../models/site-content.model';

import {
  MOCK_ABOUT_CONTENT,
  MOCK_CONTACT_CONTENT,
  MOCK_HOME_CONTENT,
  MOCK_PREMIUM_SERVICES
} from './site-content.mock';


@Injectable({
  providedIn: 'root'
})
export class SiteContentService {

  getHomeContent(): Observable<HomeContent> {
    return of(MOCK_HOME_CONTENT);
  }


  getPremiumServices(): Observable<PremiumService[]> {
    return of(MOCK_PREMIUM_SERVICES);
  }


  getAboutContent(): Observable<AboutContent> {
    return of(MOCK_ABOUT_CONTENT);
  }


  getContactContent(): Observable<ContactContent> {
    return of(MOCK_CONTACT_CONTENT);
  }

}