import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { COMPOUND_PERIOD, CONTRIBUTE_FREQUENCY, CONTRIBUTE_TIMING } from '@shared/data-access';
import { NgxMaskDirective } from 'ngx-mask';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ErrorMessagePipe } from '@shared/core';
import { MatSelectModule } from '@angular/material/select';

const material = [MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule];

const internal = [ErrorMessagePipe];

const thirdParty = [NgxMaskDirective];

@Component({
    selector: 'p-investment-calculator',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ...internal, ...material, ...thirdParty],
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
        investLength: [10, [Validators.required, Validators.min(1)]],
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
