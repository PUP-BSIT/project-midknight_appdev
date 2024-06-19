import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  selectedTab: string = 'change-email';

  constructor(
    private router: Router
  ) {}

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  close():void{
    this.router.navigateByUrl('/profile');
  }
}
