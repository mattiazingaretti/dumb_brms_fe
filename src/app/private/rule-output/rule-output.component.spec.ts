import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleOutputComponent } from './rule-output.component';

describe('RuleOutputComponent', () => {
  let component: RuleOutputComponent;
  let fixture: ComponentFixture<RuleOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RuleOutputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RuleOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
