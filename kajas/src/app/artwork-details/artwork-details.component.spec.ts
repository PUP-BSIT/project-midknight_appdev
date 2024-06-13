import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtworkDetailsComponent } from './artwork-details.component';

describe('ArtworkDetailsComponent', () => {
  let component: ArtworkDetailsComponent;
  let fixture: ComponentFixture<ArtworkDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArtworkDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArtworkDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
