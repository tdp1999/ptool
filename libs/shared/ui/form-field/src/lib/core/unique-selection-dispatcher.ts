import { Injectable, OnDestroy } from '@angular/core';

export type UniqueSelectionDispatcherListener = (
    id: string,
    name: string
) => void;

@Injectable({ providedIn: 'root' })
export class UniqueSelectionDispatcher implements OnDestroy {
    private _listeners: UniqueSelectionDispatcherListener[] = [];

    notify(id: string, name: string) {
        for (const listener of this._listeners) {
            listener(id, name);
        }
    }

    listen(listener: UniqueSelectionDispatcherListener): () => void {
        this._listeners.push(listener);
        return () => {
            this._listeners = this._listeners.filter(
                (registered: UniqueSelectionDispatcherListener) => {
                    return listener !== registered;
                }
            );
        };
    }

    ngOnDestroy() {
        this._listeners = [];
    }
}
