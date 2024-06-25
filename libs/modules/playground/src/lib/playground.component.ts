import { OverlayModule } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Option, Select } from '@shared/ui/form-field';

@Component({
    selector: 'p-playground',
    standalone: true,
    imports: [Select, Option, OverlayModule],
    templateUrl: './playground.component.html',
    styleUrl: './playground.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaygroundComponent {
    isOpen = true;
}
