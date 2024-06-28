import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionStorageService } from 'angular-web-storage';
import { ArtworkService } from '../../services/artwork.service';
import axios from 'axios';

@Component({
  selector: 'app-public-artwork-details',
  templateUrl: './public-artwork-details.component.html',
  styleUrls: ['./public-artwork-details.component.css']
})
export class PublicArtworkDetailsComponent implements OnInit {
  artwork: any = null;
  sessionStorageId: string | null = '';

  constructor(
    public sessionStorage: SessionStorageService,
    private route: ActivatedRoute,
    private router: Router,
    private artworkService: ArtworkService
  ) {}

  ngOnInit(): void {
    this.sessionStorageId = this.sessionStorage.get('id');
    const artworkTitle = this.route.snapshot.paramMap.get('title');
    const artworkId = this.artworkService.getArtworkId();

    if (artworkTitle && artworkId) {
      const url = `https://kajas-backend.onrender.com/api/artwork/title/${artworkTitle}/id/${artworkId}`;
      axios.get(url)
        .then(response => {
          if (response.status === 200) {
            this.artwork = response.data;
          }
        })
        .catch(error => {
          console.error('Error fetching artwork details:', error);
        });
    }
  }

  getAbsoluteUrl(relativePath: string): string {
    return `https://kajas-backend.onrender.com/uploads/${relativePath}`;
  }

  closeDetails(): void {
    const username = this.route.snapshot.paramMap.get('username');
    this.router.navigate([`/profile/${username}`]);
  }
}