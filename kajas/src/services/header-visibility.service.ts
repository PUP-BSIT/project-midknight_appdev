import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class HeaderVisibilityService {
  private showHeaderSubject = new BehaviorSubject<boolean>(true);
  showHeader$ = this.showHeaderSubject.asObservable();

  private routesWithHeader = [
    /^\/profile$/,
    /^\/setup-profile$/,
    /^\/edit-profile$/,
    /^\/artwork-details\/[^\/]+$/, 
    /^\/add-artwork$/,
    /^\/edit-artwork\/[^\/]+$/, 
    /^\/settings$/,
  ];

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const showHeader = this.routesWithHeader.some(routeRegex => routeRegex.test(event.urlAfterRedirects));
        this.showHeaderSubject.next(showHeader);
      }
    });
  }
}
