import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import axios from 'axios';
import { SessionStorageService } from 'angular-web-storage';

@Component({
  selector: 'app-add-artwork',
  templateUrl: './add-artwork.component.html',
  styleUrls: ['./add-artwork.component.css']
})
export class AddArtworkComponent implements OnInit {
  artworkForm: FormGroup;
  showModal = false;
  modalMessage = '';
  artworkImageUrl: string | ArrayBuffer | null = '';

  artworkTitlePlaceholder = this.sessionStorage.get('title') || '';
  artworkDatePlaceholder = this.sessionStorage.get('date_created') || '';
  artworkDescriptionPlaceholder = this.sessionStorage.get('description') || '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private sessionStorage: SessionStorageService
  ) {
    this.artworkForm = this.fb.group({
      id: [this.sessionStorage.get('id')], 
      artwork: [''],
      title: [this.sessionStorage.get('title'), {
        validators: [
          Validators.required
        ]
      }],
      date_created: ['', Validators.required],
      details: ['', {
        validators: [
          Validators.maxLength(250)
        ]
      }],
      image: ['']
    });
  }

  ngOnInit(): void {
    const userId = this.sessionStorage.get('user_id');
    if (userId) {
      this.artworkForm.patchValue({ user_id: userId });
    } else {
      this.modalMessage = 'User is not logged in.';
      this.showModal = true;
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.artworkImageUrl = e.target.result;
        this.artworkForm.patchValue({ image: file });
      };
      reader.readAsDataURL(file);
    }
  }

  async onSubmit(): Promise<void> {
    const url = "http://localhost:4000/api/addArtwork";
    const artworkFormData = new FormData();

    if (this.artworkForm.invalid) {
        this.artworkForm.markAllAsTouched();
        this.modalMessage = 'Please fill out the form accurately and completely.';
        this.showModal = true;
        return;
    }

    Object.keys(this.artworkForm.controls).forEach(key => {
        const control = this.artworkForm.get(key);
        if (control && control.value !== null && control.value !== undefined) {
            if (key === 'image' && control.value instanceof File) {
              artworkFormData.append(key, control.value);
            } else {
              artworkFormData.append(key, control.value);
            }
        }
    });

    try {
        const response = await axios.post(url, artworkFormData);
        if (response.status === 200) {
            this.modalMessage = 'Artwork Added Successfully!';
            this.showModal = true;

            this.sessionStorage.set('description', this.artworkForm.controls.description.value);
            this.sessionStorage.set('artwork', response.data.updatedartwork);
        }
    } catch (error) {
      console.error('Error submitting the artwork:', error);
    }
}

  closeModal(): void {
    if (this.modalMessage === 'Artwork Added Successfully!') {
      this.router.navigateByUrl('/profile');
    }
    this.showModal = false;
  }

  close(): void {
    this.router.navigateByUrl('/profile');
  }
}
