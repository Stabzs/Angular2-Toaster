import { 
    trigger, state, style, animate, transition, group 
} from '@angular/animations';

export const Transitions = [
    trigger('toastState', [
        state('flyRight, flyLeft, slideDown, slideDown, slideUp, slideUp, fade', 
            style({ opacity: 1, transform: 'translate(0,0)' })),
        transition('void => flyRight', [
            style({
                opacity: 0,
                transform: 'translateX(100%)',
                height: 0
            }),
            animate('0.15s ease-in', style({
                opacity: 1,
                height: '*'
            })),
            animate('0.25s 15ms ease-in')
        ]),
        transition('flyRight => void', [
            animate('0.25s ease-out', style({
                opacity: 0,
                transform: 'translateX(100%)'
            })),
            animate('0.15s ease-out', style({
                height: 0
            }))
        ]),
        transition('void => flyLeft', [
            style({
                opacity: 0, 
                transform: 'translateX(-100%)',
                height: 0
            }),
            animate('0.15s ease-in', style({
                opacity: 1,
                height: '*'
            })),
            animate('0.25s 15ms ease-in')
        ]),
        transition('flyLeft => void', [
            animate('0.25s 10ms ease-out', style({
                opacity: 0, 
                transform: 'translateX(-100%)'
            })),
            animate('0.15s ease-out', style({
                height: 0
            }))
        ]),
        transition('void => slideDown', [
            style({
                opacity: 0, 
                transform: 'translateY(-500%)',
                height: 0
            }),
            group([
                animate('0.2s ease-in', style({
                    height: '*'
                })),
                animate('0.4s ease-in', style({
                    transform: 'translate(0,0)'
                })), 
                animate('0.3s 0.1s ease-in', style({
                    opacity: 1
                }))
            ])
        ]),
        transition('slideDown => void', group([
            animate('0.3s ease-out', style({
                opacity: 0
            })),
            animate('0.4s ease-out', style({
                transform: 'translateY(-500%)'
            })), 
            animate('0.2s 0.2s ease-out', style({
                height: 0
            }))
        ])),
        transition('void => slideUp', [
            style({
                opacity: 0, 
                transform: 'translateY(1000%)',
                height: 0
            }),
            group([
                animate('0.2s ease-in', style({
                    height: '*'
                })),
                animate('0.5s ease-in', style({
                    transform: 'translate(0,0)'
                })), 
                animate('0.3s 0.1s ease-in', style({
                    opacity: 1
                }))
            ])
        ]),
        transition('slideUp => void', group([
            animate('0.3s ease-out', style({
                opacity: 0
            })),
            animate('0.5s ease-out', style({
                transform: 'translateY(1000%)'
            })), 
            animate('0.3s 0.15s ease-out', style({
                height: 0
            }))
        ])),
        transition('void => fade', [
            style({
                opacity: 0,
                height: 0
            }),
            animate('0.20s ease-in', style({
                height: '*'
            })),
            animate('0.15s ease-in', style({
                opacity: 1
            }))
            
        ]),
        transition('fade => void', [
            group([
                animate('0.0s ease-out', style({
                    // reposition the background to prevent
                    // a ghost image during transition
                    'background-position': '-99999px'
                })),
                animate('0.15s ease-out', style({
                    opacity: 0,
                    'background-image': ''
                })),
                animate('0.3s 20ms ease-out', style({
                    height: 0
                }))
            ])
        ])
    ]),
]