import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionStorageService } from 'angular-web-storage';
import { ArtworkService } from '../../services/artwork.service';

@Component({
  selector: 'app-edit-artwork',
  templateUrl: './edit-artwork.component.html',
  styleUrls: ['./edit-artwork.component.css'],
})
export class EditArtworkComponent implements OnInit {
  artworkForm: FormGroup;
  imageUrl: string | null = null;
  showModal = false;
  modalMessage = '';
  artwork: any;
  titlePlaceholder = '';
  dateCreatedPlaceholder = '';
  descriptionPlaceholder = '';
  showLoader = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private sessionStorage: SessionStorageService,
    private artworkService: ArtworkService
  ) {
    this.artworkForm = this.fb.group({
      title: ['', {
        validators: [
          Validators.required
        ]
      }],
      date: ['', {
        validators: [
          Validators.required
        ]
      }],
      details: [''],
    });
  }

  ngOnInit(): void {
    this.loadArtworkData();
  }

  loadArtworkData(): void {
    const artworkTitle = this.route.snapshot.paramMap.get('title');
    const artworkId = this.artworkService.getArtworkId();

    if (artworkTitle && artworkId) {
      const url = `https://api.kajas.site/api/artwork/title/${artworkTitle}/id/${artworkId}`;
      this.http.get(url).subscribe({
        next: (response: any) => {
          this.artwork = response;
          this.artworkForm.patchValue({
            title: this.artwork.title,
            date: this.formatDate(this.artwork.date_created),
            details: this.artwork.description,
          });
          this.imageUrl = this.artwork.image_url;
          this.updatePlaceholders();
        },
        error: (error) => {
          console.error('Error fetching artwork data:', error);
        }
      });      
    } else {
      console.error('artworkId or userId is missing');
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  updatePlaceholders(): void {
    this.titlePlaceholder = this.artworkForm.get('title')?.value || '';
    this.dateCreatedPlaceholder = this.artworkForm.get('date')?.value || '';
    this.descriptionPlaceholder = this.artworkForm.get('details')?.value || '';
  }

  getAbsoluteUrl(relativePath: string): string {
    return `https://api.kajas.site/uploads/${relativePath}`;
  }

  save(): void {
    const artworkId = this.artworkService.getArtworkId();
    const url = `https://api.kajas.site/api/artwork/${artworkId}`;

    if (this.artworkForm.invalid) {
      this.artworkForm.markAllAsTouched();
      this.modalMessage = 'Please fill out the form accurately and completely.';
      this.showModal = true;
      return;
    }

    const updatedFields: { [key: string]: any } = {};
    Object.keys(this.artworkForm.controls).forEach((key) => {
      const control = this.artworkForm.get(key);
      if (control) {
        if (key === 'details' && !control.value) {
          updatedFields['description'] = 'Description from the artist not provided.';
        } else if (control.value !== this.artwork[key]) {
          if (key === 'date') {
            updatedFields['date_created'] = control.value;
          } else if (key === 'details') {
            updatedFields['description'] = control.value;
          } else {
            updatedFields[key] = control.value;
          }
        }
      }
    });

    if (Object.keys(updatedFields).length === 0) {
      this.modalMessage = 'No changes detected.';
      this.showModal = true;
      return;
    }

    this.showLoader = true;
    this.http.put(url, updatedFields).subscribe({
      next: (response: any) => {
        if (response) {
          this.modalMessage = 'Updating artwork details...';
          this.updatePlaceholders();

          setTimeout(() => {
            this.showLoader = false;
            this.router.navigateByUrl('/profile');
          }, 3000);
        } else {
          throw new Error('No response from server');
        }
      },
      error: (error) => {
        this.showLoader = false;
        console.error('Error updating artwork:', error);
        this.modalMessage = 'There was an error updating your artwork. Please try again.';
        this.showModal = true;
      }
    });    
  }

  getErrorMessage(controlName: string): string {
    const control = this.artworkForm.get(controlName);
    if (control && control.errors) {
      if (control.errors.required) {
        return `${this.capitalizeFirstLetter(controlName)} is required.`;
      }
    }
    return '';
  }

  private capitalizeFirstLetter(string: string): string {
    return (
      string.charAt(0).toUpperCase() +
      string.slice(1).replace(/([A-Z])/g, ' $1')
    );
  }

  cancel(): void {
    this.router.navigate(['/profile']);
  }

  closeModal(): void {
    this.showModal = false;
  }
}
