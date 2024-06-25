import {
    AnimationTriggerMetadata,
    animate,
    animateChild,
    query,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';

export const FormFieldAnimations: {
    readonly transitionMessages: AnimationTriggerMetadata;
} = {
    /** Animation that transitions the form field's error and hint messages. */
    transitionMessages: trigger('transitionMessages', [
        state('enter', style({ opacity: 1, transform: 'translateY(0%)' })),
        transition('void => enter', [
            style({ opacity: 0, transform: 'translateY(-5px)' }),
            animate('300ms cubic-bezier(0.55, 0, 0.55, 0.2)'),
        ]),
    ]),
};

export const SelectAnimations: {
    readonly transformPanelWrap: AnimationTriggerMetadata;
    readonly transformPanel: AnimationTriggerMetadata;
} = {
    transformPanelWrap: trigger('transformPanelWrap', [
        transition(
            '* => void',
            query('@transformPanel', [animateChild()], { optional: true })
        ),
    ]),

    /** This animation transforms the select's overlay panel on and off the page. */
    transformPanel: trigger('transformPanel', [
        state(
            'void',
            style({
                opacity: 0,
                transform: 'scale(1, 0.8)',
            })
        ),
        transition(
            'void => showing',
            animate(
                '120ms cubic-bezier(0, 0, 0.2, 1)',
                style({
                    opacity: 1,
                    transform: 'scale(1, 1)',
                })
            )
        ),
        transition('* => void', animate('100ms linear', style({ opacity: 0 }))),
    ]),
};
