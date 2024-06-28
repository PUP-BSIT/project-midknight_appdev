import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ArtworkService {
  private apiUrl = 'https://kajas-backend.onrender.com/api/artwork';

  constructor(private http: HttpClient) {}

  setArtworkId(id: string): void {
    sessionStorage.setItem('artworkId', id);
  }

  getArtworkId(): string | null {
    return sessionStorage.getItem('artworkId');
  }

  getArtworkById(id: string) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  updateArtwork(artwork: any) {
    return this.http.put(`${this.apiUrl}/${artwork.id}`, artwork);
  }
}
