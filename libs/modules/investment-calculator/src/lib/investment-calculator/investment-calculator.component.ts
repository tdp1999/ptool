import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { COMPOUND_PERIOD } from '@shared/data-access';

@Component({
    selector: 'p-investment-calculator',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './investment-calculator.component.html',
    styleUrl: './investment-calculator.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvestmentCalculatorComponent {
    private fb = inject(FormBuilder);

    public compoundPeriod = COMPOUND_PERIOD;

    public form = this.fb.group({
        startingAmount: [20000, Validators.required],
        duration: [10, Validators.required],
        returnRate: [6, Validators.required],
        compoundPeriod: [COMPOUND_PERIOD[2].value, Validators.required],
        additionalContribution: [1000, Validators.required],
    });

    submit() {
        console.log(this.form.value);
    }
}
