import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { LocationService } from '../../services/location.service';
import { SessionStorageService } from 'angular-web-storage';
import { Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-setup-profile',
  templateUrl: './setup-profile.component.html',
  styleUrls: ['./setup-profile.component.css']
})
export class SetupProfileComponent implements OnInit {
  profileForm: FormGroup;
  countries: any[] = [];
  cities: any[] = [];
  selectedCountryName: string = '';
  showModal: boolean = false;
  modalMessage: string = '';
  profileImageUrl: string | ArrayBuffer | null = '';

  firstNamePlaceholder: string = '';
  lastNamePlaceholder: string = '';
  middleNamePlaceholder: string = 'Middle Name';
  emailPlaceholder: string = '';
  kajasPlaceholder: string = '';

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService,
    private sessionStorage: SessionStorageService,
    private router: Router
  ) {
    
    this.profileForm = this.fb.group({
      id: [this.sessionStorage.get('id')],
      profile: [''],
      bio: ['', {
        validators: [
          Validators.maxLength(250)
        ]
      }],
      firstName: [this.sessionStorage.get('first_name'), {
        validators: [
          Validators.required
        ]
      }],
      lastName: [this.sessionStorage.get('last_name'), {
        validators: [
          Validators.required
        ]
      }],
      middleName: [this.sessionStorage.get('middle_name')],
      email: [{ value: this.sessionStorage.get('email'), 
        disabled: true }],
      country: ['', {
        validators: [
          Validators.required
        ]
      }],
      city: ['', {
        validators: [
          Validators.required
        ]
      }],
      linkedIn: ['', {
        validators: [
          this.urlValidator(), 
          this.socialMediaValidator('linkedin')
        ]
      }],
      facebook: ['', {
        validators: [
          this.urlValidator(), 
          this.socialMediaValidator('facebook')
        ]
      }],
      instagram: ['', {
        validators: [
          this.urlValidator(), 
          this.socialMediaValidator('instagram')
        ]
      }],
      website: ['', {
        validators: [
          this.urlValidator()
        ]
      }],
      kajas_link: [this.sessionStorage.get('username'), {
        validators: [
          Validators.required
        ]
      }],
    });
  }

  ngOnInit(): void {
    this.firstNamePlaceholder = this.sessionStorage.get('first_name') || '';
    this.lastNamePlaceholder = this.sessionStorage.get('last_name') || '';
    this.middleNamePlaceholder = this.sessionStorage.get('middle_name') || 'Middle Name';
    this.emailPlaceholder = this.sessionStorage.get('email') || '';
    this.kajasPlaceholder = this.sessionStorage.get('username') || '';

    this.locationService.getCountries().subscribe(data => {
      this.countries = data;
      this.countries.sort((a, b) => a.name.localeCompare(b.name));
    });
  }

  urlValidator(): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
      return urlPattern.test(control.value) ? null : { invalidUrl: true };
    };
  }

  socialMediaValidator(platform: string): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const patterns: { [key: string]: RegExp } = {
        linkedin: /^https:\/\/(www\.)?linkedin\.com\/.*$/i,
        facebook: /^https:\/\/(www\.)?facebook\.com\/.*$/i,
        instagram: /^https:\/\/(www\.)?instagram\.com\/.*$/i
      };
      return patterns[platform].test(control.value) ? null : { invalidSocialMediaUrl: true };
    };
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImageUrl = e.target.result;
        this.profileForm.patchValue({ profile: file });
      };
      reader.readAsDataURL(file);
    }
  }

  onCountryChange(event: Event): void {
    const countryCode = (event.target as HTMLSelectElement).value;
    this.selectedCountryName = this.countries.find(country => country.id === countryCode)?.name || '';
    this.profileForm.patchValue({ country: this.selectedCountryName });

    this.locationService.getCities(countryCode).subscribe(data => {
      this.cities = data.filter(city => city['country code'] === countryCode);
      this.cities.sort((a, b) => a.name.localeCompare(b.name));
    });
  }

  onSubmit(): void {
    const url = "http://localhost:4000/api/setProfile";
    const formData = new FormData();

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      this.modalMessage = 'Please fill out the form accurately and completely.';
      this.showModal = true;
      return;
    }

    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      if (control && control.value !== null && control.value !== undefined) {
        if (key === 'profile' && control.value instanceof File) {
          formData.append(key, control.value);
        } else {
          formData.append(key, control.value);
        }
      }
    });

    axios.post(url, formData)
      .then(response => {
        if (response.status === 200) {
          this.modalMessage = 'Profile Setup Successfully!';
          this.showModal = true;

          this.sessionStorage.set('city', this.profileForm.controls.city.value);
          this.sessionStorage.set('country', this.profileForm.controls.country.value);
          this.sessionStorage.set('bio', this.profileForm.controls.bio.value);
          this.sessionStorage.set('profile', response.data.updatedprofile);
          this.sessionStorage.set('linkedin', this.profileForm.controls.linkedIn.value);
          this.sessionStorage.set('facebook', this.profileForm.controls.facebook.value);
          this.sessionStorage.set('instagram', this.profileForm.controls.instagram.value);
          this.sessionStorage.set('website', this.profileForm.controls.website.value);
          this.sessionStorage.set('kajas_link', this.profileForm.controls.kajas_link.value);
        }
      })
      .catch(error => {
        console.error('Error submitting the profile data:', error);
      });
  }

  getErrorMessage(controlName: string): string {
    const control = this.profileForm.get(controlName);
    if (control && control.errors) {
      if (control.errors.required) {
        return `${this.capitalizeFirstLetter(controlName)} is required.`;
      } else if (control.errors.invalidUrl) {
        return `${this.capitalizeFirstLetter(controlName)} must be a valid URL.`;
      } else if (control.errors.invalidSocialMediaUrl) {
        return `${this.capitalizeFirstLetter(controlName)} must be a valid ${controlName} URL.`;
      }
    }
    return '';
  }

  private capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1).replace(/([A-Z])/g, ' $1');
  }

  closeModal(): void {
    if (this.modalMessage === 'Profile Setup Successfully!') {
      this.router.navigateByUrl('/profile');
    }
    this.showModal = false;
  }

  getAbsoluteUrl(relativePath: string): string {
    return `http://localhost:4000/uploads/${relativePath}`;
  }
}
