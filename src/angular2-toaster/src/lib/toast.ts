import { BodyOutputType } from './bodyOutputType';

export interface Toast {
    type: ToastType;
    title?: string;
    body?: any;
    toastId?: string;
    toastContainerId?: number;
    onShowCallback?: OnActionCallback;
    onHideCallback?: OnActionCallback;
    onClickCallback?: OnActionCallback;
    timeout?: number;
    bodyOutputType?: BodyOutputType;
    showCloseButton?: boolean;
    closeHtml?: string;
    data?: any;
    tapToDismiss?: boolean;
    progressBar?: boolean;
    progressBarDirection?: ProgressBarDirection
}

export type ToastType = 'success' | 'info' | 'warning' | 'wait' | 'error';
export type OnActionCallback = (toast: Toast) => void;
export type ProgressBarDirection = 'decreasing' | 'increasing';
