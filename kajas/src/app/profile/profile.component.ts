import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from 'angular-web-storage';
import { Router } from '@angular/router';
import { Artwork } from '../../models/user.model';
import { ArtworkService } from '../../services/artwork.service';
import axios from 'axios';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  firstName = '';
  lastName = '';
  country = '';
  city = '';
  bio = '';
  profile = '';
  linkedin = '';
  facebook = '';
  instagram = '';
  website = '';
  kajasLink = '';
  artworks: any[] = [];
  message = '';
  showDeleteButton = false;
  showConfirmModal = false;
  showMessageModal= false;
  modalMessage = '';
  selectedArtworkForDeletion: any = null;
  showLoader = false;

  constructor(
    private sessionStorage: SessionStorageService,
    private router: Router,
    private artworkService: ArtworkService
  ) {}

  ngOnInit(): void {
    const profilePath = this.sessionStorage.get('profile');
    const id = this.sessionStorage.get('id');

    this.firstName = this.sessionStorage.get('first_name') || '';
    this.lastName = this.sessionStorage.get('last_name') || '';
    this.country = this.sessionStorage.get('country') || '';
    this.city = this.sessionStorage.get('city') || '';
    this.bio = this.sessionStorage.get('bio') || '';
    this.profile = profilePath ? this.getAbsoluteUrl(profilePath) : '../../assets/default-profile.png';
    this.linkedin = this.sessionStorage.get('linkedin') || '';
    this.facebook = this.sessionStorage.get('facebook') || '';
    this.instagram = this.sessionStorage.get('instagram') || '';
    this.website = this.sessionStorage.get('website') || '';
    this.kajasLink = this.sessionStorage.get('kajas_link') || '';

    axios.get(`http://localhost:4000/api/artworks/id?id=${id}`)
      .then(response => {
        if (response.status === 200 && response.data.data && response.data.data.length > 0) {
          this.artworks = response.data.data.map(item => ({
            status: item.status,
            artwork_id: item.artwork_id,
            date_created: item.date_created,
            description: item.description,
            image_url: item.image_url,
            title: item.title,
            user_id: item.user_id,
          }));
        } else {
          this.message = "No Artworks Yet...";
        }
      })
      .catch(error => {
        console.error('Error fetching artworks:', error);
      });
  }

  copy(text: string): void {
    navigator.clipboard.writeText(text).then(
      () => {
        this.modalMessage = 'Profile link copied to clipboard!';
        this.showMessageModal = true;
      },
      (err) => {
        console.error('Could not copy text: ', err);
        this.modalMessage = 'Failed to copy the link. Please try again.';
        this.showMessageModal = true;
      }
    );
  }  

  deleteArtwork(artworkId: number): void {
    this.showLoader = true;
    this.modalMessage = 'Deleting artwork...';

    axios.post(`http://localhost:4000/api/artwork/delete/${artworkId}`)
      .then(response => {
        if (response.status === 200) {
          const deletedArtwork = this.selectedArtworkForDeletion;

          setTimeout(() => {
            this.modalMessage = `Successfully deleted the artwork '${deletedArtwork?.title}'.`;
            this.artworks = this.artworks.filter(artwork => artwork.artwork_id !== artworkId);
            this.showLoader = false;
          }, 3000);
        } else {
          this.showLoader = false;
          this.modalMessage = `Failed to delete artwork with ID ${artworkId}.`;
        }
      })
      .catch(error => {
        this.showLoader = false;
        console.error(`Error deleting artwork with ID ${artworkId}:`, error);
        this.modalMessage = `Error deleting artwork with ID ${artworkId}. Please try again later.`;
      })
      .finally(() => {
        this.showConfirmModal = false;
        this.showMessageModal = true;
      });
  }

  toggleDelete(): void {
    this.showDeleteButton = !this.showDeleteButton;
  }

  trackByFn(index: number, artwork: Artwork): string {
    return artwork.artwork_id;
  }

  getAbsoluteUrl(relativePath: string): string {
    return `http://localhost:4000/uploads/${relativePath}`;
  }

  viewArtworkDetails(artwork: Artwork): void {
    const artworkTitle = artwork.title.split(' ').join('-');
    this.artworkService.setArtworkId(artwork.artwork_id);
    this.router.navigate(['/artwork-details', artworkTitle]);
  }

  openDeleteModal(artwork: Artwork): void {
    this.selectedArtworkForDeletion = artwork;
    this.modalMessage = `Are you sure you want to delete your artwork '${artwork.title}'?`;
    this.showConfirmModal = true;
  }

  cancelDelete(): void {
    this.showConfirmModal = false;
    this.selectedArtworkForDeletion = null;
  }

  closeModal(): void {
    this.showConfirmModal = false;
  }

  closeMessageModal(): void {
    this.showMessageModal = false;
  }
}
