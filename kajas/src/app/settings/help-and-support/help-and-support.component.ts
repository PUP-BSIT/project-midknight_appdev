import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalService } from '../../../services/modal.service';
import { SessionStorageService } from 'angular-web-storage';
import axios from 'axios';

@Component({
  selector: 'app-help-and-support',
  templateUrl: './help-and-support.component.html',
  styleUrls: ['./help-and-support.component.css']
})
export class HelpAndSupportComponent{
  helpForm: FormGroup;
  selectedFile: File = null;
  imagePreview: string | ArrayBuffer = '';
  userEmail = this.sessionStorage.get('email') || '';
  modalMessage = '';
  showModal = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private modalService: ModalService,
    private sessionStorage: SessionStorageService // Inject SessionStorageService
  ) {
    this.helpForm = this.fb.group({
      image: ['', this.imageRequiredValidator()],
      message: ['', {
        validators: [
          Validators.required,
          Validators.minLength(10),
        ]
      }]
    });
  }

  onSubmit() {
    if (this.helpForm.invalid) {
      this.helpForm.markAllAsTouched();
      this.showModalMessage('Please fill out the form accurately and completely.');
      return;
    }

    const formData = new FormData();
    formData.append('message', this.helpForm.get('message').value);
    formData.append('email', this.userEmail);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    axios.post('http://localhost:4000/api/support', formData)
      .then(response => {
        if (response.status === 200) {
          this.showModalMessage('Issue submitted successfully!');
        }
      })
      .catch(error => {
        console.error('Error submitting the issue:', error);
        this.showModalMessage('Unable to process the request. Please try again later.');
      });

    console.log('Form submitted successfully!');
  }

  showModalMessage(message: string) {
    this.modalMessage = message;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  getErrorMessage(controlName: string): string {
    const control = this.helpForm.get(controlName);
    if (control && control.errors) {
      if (control.errors.required) {
        return `${this.capitalizeFirstLetter(controlName)} is required.`;
      } else if (control.errors.minlength) {
        return `Minimum length is 10 characters`;
      } else if (control.errors.imageRequired) {
        return `Image is required.`;
      }
    }
    return '';
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files[0];
    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);

    this.helpForm.patchValue({ image: file ? 'selected' : '' });
  }

  private capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1).replace(/([A-Z])/g, ' $1');
  }

  private imageRequiredValidator() {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return this.selectedFile ? null : { imageRequired: true };
    };
  }
}
