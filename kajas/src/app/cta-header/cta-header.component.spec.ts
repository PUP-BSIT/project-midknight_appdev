import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtaHeaderComponent } from './cta-header.component';

describe('CtaHeaderComponent', () => {
  let component: CtaHeaderComponent;
  let fixture: ComponentFixture<CtaHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CtaHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CtaHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
