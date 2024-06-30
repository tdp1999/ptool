import { CommonModule, DOCUMENT, NgOptimizedImage } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    OnInit,
    Renderer2,
    inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { startWith } from 'rxjs';

@Component({
    selector: 'p-header',
    standalone: true,
    imports: [CommonModule, NgOptimizedImage, ReactiveFormsModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
    private fb = inject(FormBuilder);
    private destroyRef = inject(DestroyRef);
    private _document = inject(DOCUMENT);
    private _renderer2 = inject(Renderer2);

    public themeSeletor = this.fb.control<'light' | 'dark'>('light');

    ngOnInit(): void {
        // TODO: store user choice in local storage + check prefer color scheme
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
