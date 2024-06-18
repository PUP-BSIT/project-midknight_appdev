import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicArtworkDetailsComponent } from './public-artwork-details.component';

describe('PublicArtworkDetailsComponent', () => {
  let component: PublicArtworkDetailsComponent;
  let fixture: ComponentFixture<PublicArtworkDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PublicArtworkDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublicArtworkDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
