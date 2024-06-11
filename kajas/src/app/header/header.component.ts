import { Component, HostListener, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'angular-web-storage';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnDestroy {
  dropdownOpen = false;

  constructor(private router: Router, private session: SessionStorageService) {}

  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }

  navigateToSettings(event: MouseEvent): void {
    event.stopPropagation();
    this.router.navigate(['/settings']);
    this.closeDropdown();
  }

  logout(event: MouseEvent): void {
    event.stopPropagation();
    this.session.clear();    
    this.closeDropdown();    
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target && !target.closest('.dropdown-button')) {
      this.closeDropdown();
    }
  }

  ngOnDestroy(): void {
    this.closeDropdown();
  }
}
