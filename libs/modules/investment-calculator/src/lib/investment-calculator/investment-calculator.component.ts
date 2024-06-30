import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
    COMPOUND_PERIOD,
    CONTRIBUTE_FREQUENCY,
    CONTRIBUTE_TIMING,
    InvestmentCalculatingResult,
} from '@shared/data-access';
import { NgxMaskDirective } from 'ngx-mask';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ErrorMessagePipe } from '@shared/core';
import { MatSelectModule } from '@angular/material/select';
import { Observable, Subject } from 'rxjs';

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
    /* Injectables */
    _fb = inject(FormBuilder);

    /* Constants */
    compoundPeriod = COMPOUND_PERIOD;
    contributeTiming = CONTRIBUTE_TIMING;
    contributeFrequency = CONTRIBUTE_FREQUENCY;

    /* Reactive States */
    submit$ = new Subject<void>();
    result$: Observable<InvestmentCalculatingResult> | undefined;

    form = this._fb.group({
        startingAmount: [20000, Validators.required],
        investLength: [10, [Validators.required, Validators.min(1)]],
        returnRate: [6, Validators.required],
        compoundPeriod: [COMPOUND_PERIOD[2].value, Validators.required],
        contributeAmount: [1000, Validators.required],
        contributeTiming: [this.contributeTiming[0].value, Validators.required],
        contributeFrequency: [this.contributeFrequency[0].value, Validators.required],
    });
}
