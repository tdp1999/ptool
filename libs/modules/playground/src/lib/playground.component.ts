import { OverlayModule } from '@angular/cdk/overlay';
import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Option, PLabel, Select } from '@shared/ui/form-field';

@Component({
    selector: 'p-playground',
    standalone: true,
    imports: [
        Select,
        Option,
        OverlayModule,
        PLabel,
        ReactiveFormsModule,
        JsonPipe,
    ],
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
}
