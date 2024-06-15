import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SessionStorageService } from 'angular-web-storage';

@Component({
  selector: 'app-add-artwork',
  templateUrl: './add-artwork.component.html',
  styleUrls: ['./add-artwork.component.css']
})

export class AddArtworkComponent {
  title: string = '';
  date: string = '';
  details: string = '';
  imageUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  constructor(private http: HttpClient, private router: Router, private sessionStorage: SessionStorageService, ) {}

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files![0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = e => this.imageUrl = reader.result;
      reader.readAsDataURL(file);
    }
  }
  
  save(): void {
    if (!this.title || !this.date || !this.details || !this.selectedFile) {
      alert('All fields are required');
      return;
    }

    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('date', this.date);
    formData.append('details', this.details);
    formData.append('image', this.selectedFile);
    formData.append('userId', this.sessionStorage.get('id')); 

    this.http.post('http://localhost:4000/api/artwork/submit', formData).subscribe(response => {
      
      this.router.navigate(['/profile']);
    }, error => {
      console.error('Error submitting artwork:', error);
      
    });
  }

  cancel(): void {
    this.router.navigate(['/profile']);
  }

}
