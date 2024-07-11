import { Component, OnInit, Renderer2 } from '@angular/core';
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
  location = '';
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
  showEditButtons = false;
  showConfirmModal = false;
  showMessageModal = false;
  modalMessage = '';
  selectedArtworkForDeletion: any = null;
  showLoader = false;

  currentPage = 1;
  itemsPerPage = 12;
  totalPages = 1;

  constructor(
    private sessionStorage: SessionStorageService,
    private router: Router,
    private artworkService: ArtworkService,
    private renderer: Renderer2 
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

    this.location = this.city && this.country ? `${this.city}, ${this.country}` : this.city || this.country;

    axios.get(`https://api.kajas.site/api/artworks/id?id=${id}`)
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
          this.artworks.reverse();
          this.totalPages = Math.ceil(this.artworks.length / this.itemsPerPage);
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
        this.modalMessage = 'Your profile link has been copied to your clipboard. Feel free to share it with others!';
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

    axios.post(`https://api.kajas.site/api/artwork/delete/${artworkId}`)
      .then(response => {
        if (response.status === 200) {
          const deletedArtwork = this.selectedArtworkForDeletion;

          setTimeout(() => {
            this.modalMessage = `Successfully deleted the artwork '${deletedArtwork?.title}'.`;
            this.artworks = this.artworks.filter(artwork => artwork.artwork_id !== artworkId);
            this.totalPages = Math.ceil(this.artworks.length / this.itemsPerPage);
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

  toggleEdit(): void {
    this.showEditButtons = !this.showEditButtons;
  }

  trackByFn(index: number, artwork: Artwork): string {
    return artwork.artwork_id;
  }

  getAbsoluteUrl(relativePath: string): string {
    return `https://api.kajas.site/uploads/${relativePath}`;
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

  paginatedArtworks(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.artworks.slice(start, end);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.scrollToGallery();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.scrollToGallery();
    }
  }

  scrollToGallery(): void {
    const galleryContainer = this.renderer.selectRootElement('.kajas-link');
    if (galleryContainer) {
      galleryContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }  
}
