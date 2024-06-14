import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtaBannerComponent } from './cta-banner.component';

describe('CtaBannerComponent', () => {
  let component: CtaBannerComponent;
  let fixture: ComponentFixture<CtaBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CtaBannerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CtaBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
