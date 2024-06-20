import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalService } from '../../../services/modal.service'; 

@Component({
  selector: 'app-help-and-support',
  templateUrl: './help-and-support.component.html',
  styleUrls: ['./help-and-support.component.css']
})
export class HelpAndSupportComponent {
  @Output() showModalEvent = new EventEmitter<string>();

  helpForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private modalService: ModalService 
  ) {
    this.helpForm = this.fb.group({
      image: [''],

      message: ['', {
        validators: [
          Validators.required,
        ]
      }]
    });
  }

  onSubmit() {
    if (this.helpForm.invalid) {
      this.helpForm.markAllAsTouched();
      this.showModalEvent.emit('Please fill out the form accurately and completely.');
      return;
    }
    
    console.log('Form submitted successfully!');
  }

  getErrorMessage(controlName: string): string {
    const control = this.helpForm.get(controlName);
    if (control && control.errors) {
      if (control.errors.required) {
        return `${this.capitalizeFirstLetter(controlName)} is required.`;
      } 
    }
    return '';
  }

  private capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1).replace(/([A-Z])/g, ' $1');
  }
}
