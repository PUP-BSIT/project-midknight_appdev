import { Component } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, Event } from '@angular/router';
import { HeaderVisibilityService } from '../services/header-visibility.service';
import { LoadingService } from '../services/loading.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'kajas';
  
  showHeader$: Observable<boolean>;
  isLoading$ = this.loadingService.loading$;

  constructor(
    private headerVisibilityService: HeaderVisibilityService,
    private loadingService: LoadingService,
    private router: Router
  ) {
    this.showHeader$ = this.headerVisibilityService.showHeader$;
    
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.loadingService.showLoading();
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loadingService.hideLoading();
      }
    });
  }
}
