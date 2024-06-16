import { Component } from '@angular/core';

@Component({
  selector: 'app-cta-banner',
  templateUrl: './cta-banner.component.html',
  styleUrls: ['./cta-banner.component.css']
})
export class CtaBannerComponent {
  isBannerVisible: boolean = true;

  closeBanner(): void {
    this.isBannerVisible = false;
  }
}
