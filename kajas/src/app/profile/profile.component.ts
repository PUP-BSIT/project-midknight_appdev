import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from 'angular-web-storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  firstName = this.sessionStorage.get('first_name') || '';
  lastName = this.sessionStorage.get('last_name') || '';
  country = this.sessionStorage.get('country') || '';
  city = this.sessionStorage.get('city') || '';
  bio = this.sessionStorage.get('bio') || '';
  profile = this.getAbsoluteUrl(this.sessionStorage.get('profile') || '');
  linkedin = this.sessionStorage.get('linkedin') || '';
  facebook = this.sessionStorage.get('facebook') || '';
  instagram = this.sessionStorage.get('instagram') || '';
  website = this.sessionStorage.get('website') || '';
  kajasLink = this.sessionStorage.get('kajas_link') || '';

  constructor(
    private sessionStorage: SessionStorageService, 
    private router: Router
  ) {}

  ngOnInit(): void {}

  getAbsoluteUrl(relativePath: string): string {
    if (relativePath.startsWith('..')) {
      return `http://localhost:4000/uploads/${relativePath.split('/').pop()}`;
    }
    return relativePath;
  }
}
