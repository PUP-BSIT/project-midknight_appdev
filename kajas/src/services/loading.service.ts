import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();
  private showLoadingTimestamp: number | null = null;
  private minimumDisplayTime = 2000; 

  showLoading() {
    this.showLoadingTimestamp = Date.now();
    this.loadingSubject.next(true);
  }

  hideLoading() {
    const elapsedTime = Date.now() - (this.showLoadingTimestamp || 0);
    if (elapsedTime < this.minimumDisplayTime) {
      setTimeout(() => {
        this.loadingSubject.next(false);
      }, this.minimumDisplayTime - elapsedTime);
    } else {
      this.loadingSubject.next(false);
    }
  }
}
