import {
    CdkOverlayOrigin,
    OverlayModule,
    ViewportRuler,
} from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    DestroyRef,
    ElementRef,
    booleanAttribute,
    computed,
    contentChildren,
    inject,
    input,
    signal,
    viewChild,
} from '@angular/core';
import { SelectAnimations } from '../core';
import { Option } from '../option/option.component';

@Component({
    selector: 'p-select',
    standalone: true,
    imports: [OverlayModule],
    templateUrl: './select.component.html',
    styleUrl: './select.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [SelectAnimations.transformPanel],
    host: { ngSkipHydration: 'true', role: 'combobox' },
})
export class Select {
    /* Input */
    label = input<string>('');
    value = input<any>(null);
    disabled = input(false, { transform: booleanAttribute });
    _options = contentChildren(Option, { descendants: true });
    _overlayOrigin = viewChild(CdkOverlayOrigin);

    /* Injectables */
    _cdr = inject(ChangeDetectorRef);
    _elementRef = inject(ElementRef);
    _destroyRef = inject(DestroyRef);
    _viewportRuler = inject(ViewportRuler);
    _platform = inject(Platform);

    /* States */
    _isOpen = signal<boolean>(false);
    _canOpen = computed(
        () => !this._isOpen() && !this.disabled() && this._options().length > 0
    );

    /* Methods */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    _onChange: (value: any) => void = () => {};

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    _onTouched = () => {};

    // protected _canOpen(): boolean {
    //     return !this. && !this.disabled && this.options?.length > 0;
    // }
    _overlayWidth = computed(() => {
        if (!this._platform.isBrowser) return 0;
        if (!this._isOpen()) return 0;
        const refToMeasure =
            this._overlayOrigin()?.elementRef || this._elementRef;
        return refToMeasure?.nativeElement?.getBoundingClientRect().width || 0;
    });

    open() {
        if (!this._canOpen()) return;

        this._isOpen.set(true);
        this._cdr.markForCheck();
    }

    close() {
        if (!this._isOpen()) return;

        this._isOpen.set(false);
        this._cdr.markForCheck();
    }

    // private _assignValue(newValue: any): boolean {
    //     if (newValue !== this._value) {
    //         if (this._options()) {
    //             this._setSelectionByValue(newValue);
    //         }

    //         this._value = newValue;
    //         return true;
    //     }

    //     return false;
    // }
}
