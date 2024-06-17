import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmCancelModalComponent } from './confirm-cancel-modal.component';

describe('ConfirmCancelModalComponent', () => {
  let component: ConfirmCancelModalComponent;
  let fixture: ComponentFixture<ConfirmCancelModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmCancelModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmCancelModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
