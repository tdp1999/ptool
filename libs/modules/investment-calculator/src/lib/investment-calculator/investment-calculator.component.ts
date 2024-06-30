import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
    COMPOUND_PERIOD,
    CONTRIBUTE_FREQUENCY,
    CONTRIBUTE_TIMING,
} from '@shared/data-access';
import { NgxMaskDirective } from 'ngx-mask';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'p-investment-calculator',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgxMaskDirective,
        MatButtonModule,
    ],
    templateUrl: './investment-calculator.component.html',
    styleUrl: './investment-calculator.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvestmentCalculatorComponent {
    private fb = inject(FormBuilder);

    public compoundPeriod = COMPOUND_PERIOD;
    public contributeTiming = CONTRIBUTE_TIMING;
    public contributeFrequency = CONTRIBUTE_FREQUENCY;

    public form = this.fb.group({
        startingAmount: [20000, Validators.required],
        investLength: [10, Validators.required],
        returnRate: [6, Validators.required],
        compoundPeriod: [COMPOUND_PERIOD[2].value, Validators.required],
        contributeAmount: [1000, Validators.required],
        contributeTiming: [2, Validators.required],
        contributeFrequency: [1, Validators.required],
    });

    submit() {
        console.log(this.form.value);
    }
}
