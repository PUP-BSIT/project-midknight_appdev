import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ArtworkService } from '../../services/artwork.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit-artwork',
  templateUrl: './edit-artwork.component.html',
  styleUrls: ['./edit-artwork.component.css']
})
export class EditArtworkComponent implements OnInit {
  editArtworkForm: FormGroup;
  artworkImageUrl: string | ArrayBuffer | null = '';
  artworkData: any; 

  constructor(private fb: FormBuilder, private artworkService: ArtworkService, private router: Router, private http: HttpClient) {
    this.editArtworkForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const artworkId = this.artworkService.getArtworkId();
    this.http.get<any>(`/api/artwork/${artworkId}`).subscribe((data) => {
      this.artworkData = data;
      this.editArtworkForm.patchValue({
        title: this.artworkData.title,
        description: this.artworkData.description,
        date: this.artworkData.date,
      });
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.artworkImageUrl = e.target.result;
        this.editArtworkForm.patchValue({ image: file });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
  if (this.editArtworkForm.valid) {
    const formData = new FormData();
    Object.keys(this.editArtworkForm.controls).forEach(key => {
      const control = this.editArtworkForm.get(key);
      if (control && control.value !== null && control.value !== undefined) {
        formData.append(key, control.value);
      }
    });

    this.http.post('/api/editArtwork', formData).subscribe(response => {
      console.log('Artwork updated successfully:', response);
      this.router.navigateByUrl('/profile'); //change later
    }, error => {
      console.error('Error updating artwork:', error);
    });
  } else {
    console.log('Form has validation errors');
  }
}

  close(): void {
    this.router.navigateByUrl('/profile');
  }
}


