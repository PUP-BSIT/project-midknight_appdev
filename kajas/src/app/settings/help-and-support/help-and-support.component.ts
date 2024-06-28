import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { SessionStorageService } from 'angular-web-storage';
import axios from 'axios';

@Component({
  selector: 'app-help-and-support',
  templateUrl: './help-and-support.component.html',
  styleUrls: ['./help-and-support.component.css']
})
export class HelpAndSupportComponent{  
  @Output() showModalEvent = new EventEmitter<string>();

  helpForm: FormGroup;
  selectedFile: File = null;
  imagePreview: string | ArrayBuffer = '';
  userEmail = this.sessionStorage.get('email') || '';
  modalMessage = '';
  showLoader = false;

  constructor(
    private fb: FormBuilder,
    private sessionStorage: SessionStorageService
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
      this.showModalEvent.emit('Please fill out the form accurately and completely.');
      return;
    }
    
    this.modalMessage = 'Loading...';
    this.showLoader = true;

    const formData = new FormData();
    formData.append('message', this.helpForm.get('message').value);
    formData.append('email', this.userEmail);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    axios.post('http://localhost:4000/api/support', formData)
      .then(response => {
        this.showLoader = false;
        if (response.status === 200) {
          this.showModalEvent.emit('Your issue has been sent to our support team. Thank you for reaching out to us!');
        }
      })
      .catch(error => {
        this.showLoader = false;
        console.error('Error submitting the issue:', error);
        this.showModalEvent.emit('Unable to process the request. Please try again later.');
      });
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
