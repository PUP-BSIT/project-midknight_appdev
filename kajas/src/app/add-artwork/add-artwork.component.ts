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
  artworkImageUrl: string | ArrayBuffer | null = '';
  showModal = false;
  modalMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private sessionStorage: SessionStorageService
  ) {
    this.artworkForm = this.fb.group({
      user_id: [''], 
      title: ['', Validators.required],
      date: ['', Validators.required],
      details: ['', Validators.maxLength(250)],
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
    console.log('onSubmit called');
  
    if (this.artworkForm.invalid) {
      this.artworkForm.markAllAsTouched();
      this.modalMessage = 'Please fill out the form accurately and completely.';
      this.showModal = true;
      return;
    }
  
    const formData = new FormData();
    Object.keys(this.artworkForm.controls).forEach(key => {
      const control = this.artworkForm.get(key);
      if (control && control.value !== null && control.value !== undefined) {
        formData.append(key, control.value);
      }
    });
  
    console.log('Submitting form data:', formData); 
  
    try {
      const response = await axios.post('http://localhost:4000/api/addArtwork', formData);
      console.log('Response from server:', response); 
      if (response.status === 200) {
        this.modalMessage = 'Artwork Added Successfully!';
        this.showModal = true;
      }
    } catch (error) {
      console.error('Error occurred while submitting the artwork:', error);
      this.modalMessage = 'An error occurred while submitting the artwork.';
      this.showModal = true;
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
