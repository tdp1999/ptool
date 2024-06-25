import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ROUTES } from '@shared/data-access';

@Component({
    selector: 'p-sidebar',
    standalone: true,
    imports: [RouterModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
    routes = ROUTES;
}
