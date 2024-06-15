import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EndAmountFormComponent } from './end-amount-form.component';

describe('EndAmountFormComponent', () => {
    let component: EndAmountFormComponent;
    let fixture: ComponentFixture<EndAmountFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EndAmountFormComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EndAmountFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
