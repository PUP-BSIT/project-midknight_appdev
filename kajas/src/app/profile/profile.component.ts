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
  message = '';
  showDeleteButton = false;
  showConfirmModal = false;
  showMessageModal = false; 
  modalMessage = '';
  selectedArtworkForDeletion: any = null;

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
    }
  }

  async deleteArtwork(artworkId: number) {
    try {
      const response = await axios.post(`http://localhost:4000/api/artwork/delete/${artworkId}`);
      if (response.status === 200) {
        this.artworks = this.artworks.filter(artwork => artwork.artwork_id !== artworkId);
        const deletedArtwork = this.selectedArtworkForDeletion;
        this.modalMessage = `Successfully deleted the artwork '${deletedArtwork.title}'.`;
      } else {
        this.modalMessage = `Failed to delete artwork with ID ${artworkId}.`;
      }
    } catch (error) {
      console.error(`Error deleting artwork with ID ${artworkId}:`, error);
      this.modalMessage = `Error deleting artwork with ID ${artworkId}. Please try again later.`;
    } finally {
      this.showConfirmModal = false;
      this.showMessageModal = true; 
    }
  }
  
  toggleDelete() {
    this.showDeleteButton = !this.showDeleteButton;
  }

  trackByFn(index: number, artwork: any): number {
    return artwork.id; 
  }

  getAbsoluteUrl(relativePath: string): string {
    return `http://localhost:4000/uploads/${relativePath}`;
  }

  viewArtworkDetails(artwork) {
    const artworkTitle = artwork.title.split(' ').join('-');
    this.artworkService.setArtworkId(artwork.artwork_id);
    this.router.navigate(['/artwork-details', artworkTitle]);
  }

  openDeleteModal(artwork) {
    this.selectedArtworkForDeletion = artwork;
    this.modalMessage = `Are you sure you want to delete your artwork '${artwork.title}'?`;
    this.showConfirmModal = true;
  }

  cancelDelete() {
    this.showConfirmModal = false;
    this.selectedArtworkForDeletion = null;
  }

  closeModal() {
    this.showConfirmModal = false;
  }

  closeMessageModal() { 
    this.showMessageModal = false;
  }
}
