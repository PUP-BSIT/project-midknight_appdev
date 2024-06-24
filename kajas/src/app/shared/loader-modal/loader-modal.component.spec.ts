import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderModalComponent } from './loader-modal.component';

describe('LoaderModalComponent', () => {
  let component: LoaderModalComponent;
  let fixture: ComponentFixture<LoaderModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoaderModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoaderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
