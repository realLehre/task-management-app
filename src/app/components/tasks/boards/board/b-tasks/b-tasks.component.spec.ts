import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BTasksComponent } from './b-tasks.component';

describe('BTasksComponent', () => {
  let component: BTasksComponent;
  let fixture: ComponentFixture<BTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BTasksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
