import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeactivateAccountComponent } from './deactivate-account.component';

describe('DeactivateAccountComponent', () => {
  let component: DeactivateAccountComponent;
  let fixture: ComponentFixture<DeactivateAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeactivateAccountComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeactivateAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
