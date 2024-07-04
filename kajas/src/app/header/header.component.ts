import { Component, HostListener, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'angular-web-storage';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnDestroy {
  @Input() showHeader: boolean = true; 
  dropdownOpen = false;
  searchResults: any[] = [];
  searchFocused = false;

  constructor(
    private router: Router, 
    private session: SessionStorageService,
    private searchService: SearchService
  ) {}

  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target && !target.closest('.dropdown-button') && !target.closest('.search-field')) {
      this.closeDropdown();
      this.clearSearchResults();
    }
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
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

  ngOnDestroy(): void {
    this.closeDropdown();
  }

  async onSearch(query: string): Promise<void> {
    if (query.length < 1) {
      this.searchResults = [];
      return;
    }

    try {
      this.searchResults = await this.searchService.searchUsers(query);
    } catch (error) {
      console.error('Error fetching search results', error);
      this.searchResults = [];
    }
  }

  onSearchFocus(): void {
    this.searchFocused = true;
  }

  clearSearchResults(): void {
    this.searchResults = [];
  }

  navigateToProfile(username: string): void {
    const storedUsername = this.session.get('username');
    if (username === storedUsername) {
      window.location.href = `/profile`;
    } else {
      window.location.href = `/profile/${username}`;
    }
  }  

  getAbsoluteUrl(relativePath: string): string {
    return relativePath ? `http://api.kajas.site/uploads/${relativePath}` : '../../assets/default-profile.png';
  }

  trackById(index: number, item: any): any {
    return item.id;
  }
}
