import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from 'angular-web-storage';
import { Router } from '@angular/router';
import { ArtworkService } from '../../services/artwork.service';
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
  profile: string = '';
  linkedin = this.sessionStorage.get('linkedin') || '';
  facebook = this.sessionStorage.get('facebook') || '';
  instagram = this.sessionStorage.get('instagram') || '';
  website = this.sessionStorage.get('website') || '';
  kajasLink = this.sessionStorage.get('kajas_link') || '';
  artworks: any[] = [];
  message: string = '';

  constructor(
    private sessionStorage: SessionStorageService, 
    private router: Router,
    private artworkService: ArtworkService
  ) {}

  async ngOnInit(): Promise<void> {
    const id = this.sessionStorage.get('id');

    const profilePath = this.sessionStorage.get('profile');
    this.profile = profilePath ? this.getAbsoluteUrl(profilePath) : '../../assets/default-profile.png';

    const response = await axios.get(`http://localhost:4000/api/artworks/id?id=${id}`);
    if (response.status === 200){
      if (response.data.data && response.data.data.length > 0) {
        this.artworks = response.data.data;
      } else {
        this.message = "No Artworks Yet...";
      }
    }
  }

  getAbsoluteUrl(relativePath: string): string {
    return `http://localhost:4000/uploads/${relativePath}`;
  }

  viewArtworkDetails(artwork: any): void {
    const artworkTitle = artwork.title.split(' ').join('-');
    this.artworkService.setArtworkId(artwork.artwork_id);
    this.router.navigate(['/artwork-details', artworkTitle]);
  }
}
