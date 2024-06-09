import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from 'angular-web-storage';
import { Router } from '@angular/router';
import axios from 'axios';
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

  
  artworks: any[] = [];
  message: string = '';

  constructor(
    private sessionStorage: SessionStorageService, 
    private router: Router
    
  ) {}

  async ngOnInit(): Promise<void> {
    const id = this.sessionStorage.get('id');
    console.log(id);
    
        
    const response = await axios.get(`http://localhost:4000/api/artworks/id?id=${id}`);
    if (response.status === 200){
      console.log(response.data.data);
      
      if (response.data.data && response.data.data.length > 0) {
        this.artworks = response.data.data;
      } else {
        this.message = "No Artworks Yet...";
      }
    }

  }

  getAbsoluteUrl(relativePath: string): string {
    if (relativePath.startsWith('..')) {
      return `http://localhost:4000/uploads/${relativePath.split('/').pop()}`;
    }
    return relativePath;
  }
}
