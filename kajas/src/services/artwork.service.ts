import { Injectable } from '@angular/core';

@Injectable()
export class ArtworkService {
  private artworkId: string;

  setArtworkId(id: string): void {
    this.artworkId = id;
  }

  getArtworkId(): string {
    return this.artworkId;
  }
}
