import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackRepairComponent } from './track-repair.component';

describe('TrackRepairComponent', () => {
  let component: TrackRepairComponent;
  let fixture: ComponentFixture<TrackRepairComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackRepairComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackRepairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
