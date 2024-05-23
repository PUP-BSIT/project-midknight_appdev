import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  ngOnInit(): void {
    // Apply styles to html and body when the component is initialized
    this.renderer.setStyle(document.body, 'height', '100%');
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
    this.renderer.setStyle(document.body, 'display', 'flex');
    this.renderer.setStyle(document.body, 'justify-content', 'center');
    this.renderer.setStyle(document.body, 'align-items', 'center');
    this.renderer.setStyle(document.body, 'background', 'url("../../assets/login_bg.png") center/cover no-repeat');
    
    this.renderer.setStyle(document.documentElement, 'height', '100%');
    this.renderer.setStyle(document.documentElement, 'overflow', 'hidden');
    this.applyBackground();
    window.addEventListener('resize', () => {
      this.applyBackground();
    });
  }

  ngOnDestroy(): void {
    // Revert styles when the component is destroyed
    this.renderer.removeStyle(document.body, 'height');
    this.renderer.removeStyle(document.body, 'overflow');
    this.renderer.removeStyle(document.body, 'display');
    this.renderer.removeStyle(document.body, 'justify-content');
    this.renderer.removeStyle(document.body, 'align-items');
    this.renderer.removeStyle(document.body, 'background');
    
    this.renderer.removeStyle(document.documentElement, 'height');
    this.renderer.removeStyle(document.documentElement, 'overflow');
    window.removeEventListener('resize', () => {});
  }

  applyBackground(): void {
    if (window.innerWidth <= 425) {
      // For mobile devices
      this.renderer.setStyle(document.body, 'background', 'url("../../assets/login_mbg.png") center/cover no-repeat');
    } else {
      // For desktop
      this.renderer.setStyle(document.body, 'background', 'url("../../assets/login_bg.png") center/cover no-repeat');
    }
  }
}

