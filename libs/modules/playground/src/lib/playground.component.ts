import { OverlayModule } from '@angular/cdk/overlay';
import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
@Component({
    selector: 'p-playground',
    standalone: true,
    imports: [
        OverlayModule,
        ReactiveFormsModule,
        JsonPipe,
        MatSelectModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatRadioModule,
        MatCardModule,
    ],
    templateUrl: './playground.component.html',
    styleUrl: './playground.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaygroundComponent {}
