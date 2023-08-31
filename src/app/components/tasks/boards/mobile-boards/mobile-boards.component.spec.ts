import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileBoardsComponent } from './mobile-boards.component';

describe('MobileBoardsComponent', () => {
  let component: MobileBoardsComponent;
  let fixture: ComponentFixture<MobileBoardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileBoardsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileBoardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
