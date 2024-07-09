import { Component, OnInit, Renderer2 } from '@angular/core';
import { SessionStorageService } from 'angular-web-storage';
import { Router, ActivatedRoute } from '@angular/router';
import { Artwork, ProfileData } from '../../models/user.model';
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
  showMessageModal = false;
  modalMessage = '';
  sessionStorageId: string | null = '';

  currentPage = 1;
  itemsPerPage = 12;
  totalPages = 1;

  constructor(
    public sessionStorage: SessionStorageService,
    private router: Router,
    private route: ActivatedRoute,
    private artworkService: ArtworkService,
    private renderer: Renderer2 
  ) {}

  ngOnInit(): void {
    this.fetchProfileData();
  }

  fetchProfileData(): void {
    const username = this.route.snapshot.paramMap.get('username');
    this.sessionStorageId = this.sessionStorage.get('id');

    if (this.sessionStorageId) {
      this.showMessageModal = false;
    } else {
      this.showMessageModal = false;
    }

    axios.get<ProfileData>(`http://localhost:4000/api/profile/${username}`)
      .then(response => {
        if (response.status === 200) {
          const data = response.data;
          const profilePath = data.profile;

          this.firstName = data.first_name;
          this.lastName = data.last_name;
          this.country = data.country;
          this.city = data.city;
          this.bio = data.bio;
          this.profile = profilePath ? this.getAbsoluteUrl(profilePath) : '../../assets/default-profile.png';
          this.linkedin = data.linkedin;
          this.facebook = data.facebook;
          this.instagram = data.instagram;
          this.website = data.website;
          this.kajasLink = data.kajas_link;

          this.location = this.city && this.country ? `${this.city}, ${this.country}` : this.city || this.country;
          this.artworks = data.artworks.map(item => ({
            status: item.status,
            artwork_id: item.artwork_id,
            date_created: item.date_created,
            description: item.description,
            image_url: item.image_url,
            title: item.title,
            user_id: item.user_id,
          }));

          if (this.artworks.length === 0) {
            this.message = "No Artworks Yet...";
          }
          this.artworks.reverse();
          this.totalPages = Math.ceil(this.artworks.length / this.itemsPerPage);
        }
      })
      .catch(error => {
        console.error('Error fetching profile data:', error);
      });
  }

  copy(text: string): void {
    navigator.clipboard.writeText(text).then(
      () => {
        this.modalMessage = 'The profile link has been copied to your clipboard. Feel free to share it with others!';
        this.showMessageModal = true;
      },
      (err) => {
        console.error('Could not copy text: ', err);
        this.modalMessage = 'Failed to copy the link. Please try again.';
        this.showMessageModal = true;
      }
    );
  }

  trackByFn(index: number, artwork: Artwork): string {
    return artwork.artwork_id;
  }

  getAbsoluteUrl(relativePath: string): string {
    return `http://localhost:4000/uploads/${relativePath}`;
  }

  viewArtworkDetails(artwork: Artwork): void {
    const username = this.route.snapshot.paramMap.get('username');
    const artworkTitle = artwork.title.split(' ').join('-');
    this.artworkService.setArtworkId(artwork.artwork_id);
    this.router.navigate([`${username}/artwork-details`, artworkTitle]);
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
