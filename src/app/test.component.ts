import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'p-test',
    standalone: true,
    imports: [CommonModule],
    template: `<p>test works!</p>`,
    styles: `
    :host {
      display: block;
    }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestComponent {}
