import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from 'angular-web-storage';
import { Router, ActivatedRoute } from '@angular/router';
import { ArtworkService } from '../../services/artwork.service';
import axios from 'axios';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.css']
})
export class PublicProfileComponent implements OnInit {
  firstName = '';
  lastName = '';
  country = '';
  city = '';
  bio = '';
  profile: string = '';
  linkedin = '';
  facebook = '';
  instagram = '';
  website = '';
  kajasLink = '';
  artworks: any[] = [];
  message = '';
  showDeleteButton = false;
  showConfirmModal = false;
  showMessageModal = false; 
  modalMessage = '';
  selectedArtworkForDeletion: any = null;
  sessionStorageId: string | null = '';

  constructor(
    public sessionStorage: SessionStorageService, 
    private router: Router,
    private route: ActivatedRoute, 
    private artworkService: ArtworkService
  ) {}

  async ngOnInit(): Promise<void> {
    const username = this.route.snapshot.paramMap.get('username');
    this.sessionStorageId = this.sessionStorage.get('id');
  
    if (this.sessionStorageId) {
      this.showMessageModal = false;
    } else {
      this.showMessageModal = false;
    }

    const response = await axios.get(`http://localhost:4000/api/profile/${username}`);
    if (response.status === 200) {
      console.log(response);
      this.firstName = response.data.first_name;
      this.lastName = response.data.lastName;
      this.country = response.data.country;
      this.city = response.data.city;
      this.bio = response.data.bio;
      this.profile = this.getAbsoluteUrl(response.data.profile);
      this.linkedin = response.data.linkedin;
      this.facebook = response.data.facebook;
      this.instagram = response.data.instagram;
      this.website = response.data.website;
      this.kajasLink = response.data.kajasLink;
      this.artworks = response.data.artworks.map(item => ({
        status: item.status,
        artwork_id: item.artwork_id,
        date_created: item.date_created,
        description: item.description,
        image_url: item.image_url,
        title: item.title,
        user_id: item.user_id,
      }));
    }
  }

  trackByFn(index: number, artwork: any): number {
    return artwork.id; 
  }

  getAbsoluteUrl(relativePath: string): string {
    return `http://localhost:4000/uploads/${relativePath}`;
  }

  viewArtworkDetails(artwork) {
    const username = this.route.snapshot.paramMap.get('username');
    const artworkTitle = artwork.title.split(' ').join('-');
    this.artworkService.setArtworkId(artwork.artwork_id);
    this.router.navigate([`${username}/artwork-details`, artworkTitle]);
  }

  closeModal() {
    this.showConfirmModal = false;
  }

  closeMessageModal() { 
    this.showMessageModal = false;
  }
}
