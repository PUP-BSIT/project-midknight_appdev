import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArtworkService } from '../../services/artwork.service';
import axios from 'axios';

@Component({
  selector: 'app-artwork-details',
  templateUrl: './artwork-details.component.html',
  styleUrls: ['./artwork-details.component.css']
})
export class ArtworkDetailsComponent implements OnInit {
  artwork: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private artworkService: ArtworkService
  ) {}

  ngOnInit(): void {
    const artworkTitle = this.route.snapshot.paramMap.get('title');
    const artworkId = this.artworkService.getArtworkId();

    if (artworkTitle && artworkId) {
      const url = `http://api.kajas.site/api/artwork/title/${artworkTitle}/id/${artworkId}`;
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
    return `http://api.kajas.site/uploads/${relativePath}`;
  }

  editArtwork(): void {
    if (this.artwork && this.artwork.artwork_id) {
      const artworkTitle = this.artwork.title.split(' ').join('-');
      this.artworkService.setArtworkId(this.artwork.artwork_id);
      this.router.navigate(['/edit-artwork', artworkTitle]);
    } else {
      console.error('Artwork ID is missing or invalid');
    }
  }

  closeDetails(): void {
    this.router.navigate(['/profile']);
  }
}
