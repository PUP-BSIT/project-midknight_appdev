import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionStorageService } from 'angular-web-storage';
import axios from 'axios';

@Component({
  selector: 'app-add-artwork',
  templateUrl: './add-artwork.component.html',
  styleUrls: ['./add-artwork.component.css']
})
export class AddArtworkComponent {
  artworkForm: FormGroup;
  imageUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  showModal = false;
  modalMessage = '';
  showLoader = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private sessionStorage: SessionStorageService
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
      imageUrl: ['', {
        validators: [
          Validators.required
        ]
      }],
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
        this.artworkForm.patchValue({ imageUrl: file });
      };
      reader.readAsDataURL(file);
    }
  }

  save(): void {
    const url = "http://localhost:4000/api/artwork/submit";
    const formData = new FormData();

    if (this.artworkForm.invalid) {
      this.artworkForm.markAllAsTouched();
      if (!this.selectedFile) {
        this.modalMessage = 'Please upload the artwork you want to showcase.';
      } else {
        this.modalMessage = 'Please fill out the form accurately and completely.';
      }
      this.showModal = true;
      return;
    }

    Object.keys(this.artworkForm.controls).forEach(key => {
      const control = this.artworkForm.get(key);
      if (control && control.value !== null && control.value !== undefined) {
        if (key === 'imageUrl' && this.selectedFile) {
          formData.append(key, this.selectedFile);
        } else if (key === 'details' && !control.value) {
          formData.append(key, 'Description from the artist not provided.');
        } else {
          formData.append(key, control.value);
        }
      }
    });

    formData.append('userId', this.sessionStorage.get('id'));

    this.showLoader = true;
    axios.post(url, formData)
      .then(response => {
        if (response.status === 200) {
          this.modalMessage = 'Adding artwork...';

          setTimeout(() => {
            this.showLoader = false;
            this.router.navigateByUrl('/profile');
          }, 1000);
        }
      })
      .catch(error => {
        console.error('Error submitting artwork:', error);
        this.showLoader = false;
        this.modalMessage = 'There was an error submitting your artwork. Please try again.';
        this.showModal = true;
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
    return string.charAt(0).toUpperCase() + string.slice(1).replace(/([A-Z])/g, ' $1');
  }

  cancel(): void {
    this.router.navigate(['/profile']);
  }

  closeModal(): void {
    this.showModal = false;
  }
}
