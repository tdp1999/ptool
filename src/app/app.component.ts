import {
  AfterRenderPhase,
  Component,
  DestroyRef,
  OnDestroy,
  OnInit,
  afterNextRender,
  inject,
} from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import {
  BreakpointObserver,
  Breakpoints,
  LayoutModule,
} from '@angular/cdk/layout';
import { Subscription, filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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

  constructor() {
    afterNextRender(
      () => {
        this.router.events
          .pipe(
            filter((event) => event instanceof NavigationEnd),
            takeUntilDestroyed(this.destroyRef)
          )
          .subscribe(() => {
            setTimeout(() => {
              window.HSStaticMethods.autoInit();
            }, 100);
          });
      },
      { phase: AfterRenderPhase.Read }
    );
  }
}
