import { Component } from '@angular/core';
import { HeaderVisibilityService } from '../services/header-visibility.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent { 
  title = 'kajas';
  
  showHeader$: Observable<boolean>;

  constructor(private headerVisibilityService: HeaderVisibilityService) {
    this.showHeader$ = this.headerVisibilityService.showHeader$;
  }
}
