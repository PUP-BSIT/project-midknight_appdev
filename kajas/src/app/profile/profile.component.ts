import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from 'angular-web-storage';
import { Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{

  constructor(private sessionStorage: SessionStorageService, private router: Router) {}

  async ngOnInit(): Promise<void> {
    const url = "http://localhost:4000";
    const id = this.sessionStorage.get('id');
    try {
      const response = await axios.get(`${url}/api/location/id?${id}`);
      if (response.status === 200) {
          alert (response.data.msg);
          this.router.navigateByUrl('/setup-profile')
        }
      }
       catch (error) {
      console.error(error);
    }
  }
}

