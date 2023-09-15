import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BTaskComponent } from './b-task.component';

describe('BTaskComponent', () => {
  let component: BTaskComponent;
  let fixture: ComponentFixture<BTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BTaskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
