import { LayoutModule } from '@angular/cdk/layout';
import { Component, DestroyRef, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
    standalone: true,
    imports: [RouterModule, LayoutModule],
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    private router = inject(Router);
    private destroyRef = inject(DestroyRef);
}
