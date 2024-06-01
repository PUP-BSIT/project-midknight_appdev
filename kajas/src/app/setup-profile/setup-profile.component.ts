import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocationService } from '../../services/location.service';
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

  constructor(private fb: FormBuilder, private locationService: LocationService) {
    this.profileForm = this.fb.group({
      profilePic: [''],
      bio: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      middleName: [''],
      email: ['', [Validators.required, Validators.email]],
      country: ['', Validators.required],
      city: ['', Validators.required],
      linkedIn: [''],
      facebook: [''],
      instagram: [''],
      website: [''],
      kajasUrl: ['']
    });
  }

  ngOnInit(): void {
    this.locationService.getCountries().subscribe(data => {
      this.countries = data;
      this.countries.sort((a, b) => a.name.localeCompare(b.name)); 
    });
  }

  onCountryChange(event: Event): void {
    const countryCode = (event.target as HTMLSelectElement).value;
    this.locationService.getCities(countryCode).subscribe(data => {
      this.cities = data.filter(city => city['country code'] === countryCode);
      this.cities.sort((a, b) => a.name.localeCompare(b.name)); 
    });
  }

  async onSubmit(): Promise<void> {
    console.log(this.profileForm.value)
    const url = "http://localhost:4000/api/setProfile";
    const formData = new FormData();
    Object.keys(this.profileForm.controls).forEach(key => {
      formData.append(key, this.profileForm.get(key).value);
    });

    try {
      const response = await axios.post(url, formData);
      console.log(response.data);
    } catch (error) {
      console.error('Error submitting the profile data:', error);
    }
  }
}
