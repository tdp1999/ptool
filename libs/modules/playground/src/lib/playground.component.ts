import { OverlayModule } from '@angular/cdk/overlay';
import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
@Component({
    selector: 'p-playground',
    standalone: true,
    imports: [OverlayModule, ReactiveFormsModule, JsonPipe, MatSelectModule],
    templateUrl: './playground.component.html',
    styleUrl: './playground.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaygroundComponent {
    isOpen = true;

    fb = inject(FormBuilder);

    form = this.fb.group({
        select: ['1'],
    });

    foods = [
        { value: 'steak-0', viewValue: 'Steak' },
        { value: 'pizza-1', viewValue: 'Pizza' },
        { value: 'tacos-2', viewValue: 'Tacos' },
    ];

    selectedFood = this.foods[2].value;
}
