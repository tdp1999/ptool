import { LayoutModule } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import {
    Component,
    DestroyRef,
    OnInit,
    Renderer2,
    inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FooterComponent, HeaderComponent } from '@layout';
import { startWith } from 'rxjs';

@Component({
    standalone: true,
    imports: [
        RouterModule,
        LayoutModule,
        ReactiveFormsModule,
        HeaderComponent,
        FooterComponent,
    ],
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
    private fb = inject(FormBuilder);
    private destroyRef = inject(DestroyRef);
    private _document = inject(DOCUMENT);
    private _renderer2 = inject(Renderer2);

    public themeSeletor = this.fb.control<'light' | 'dark'>('light');

    ngOnInit(): void {
        this.themeSeletor.valueChanges
            .pipe(
                startWith(this.themeSeletor.value),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((theme) => {
                if (theme == 'light') {
                    this._renderer2.removeClass(this._document.body, 'dark');
                    this._renderer2.addClass(this._document.body, 'light');
                } else {
                    this._renderer2.removeClass(this._document.body, 'light');
                    this._renderer2.addClass(this._document.body, 'dark');
                }
            });
    }
}
