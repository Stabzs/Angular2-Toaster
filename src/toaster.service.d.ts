import { EventEmitter } from 'angular2/core';
import { Toast } from './toast';
export declare class ToasterService {
    addToast: EventEmitter<Toast>;
    clearToasts: EventEmitter<IClearWrapper>;
    pop(type: string | Toast, title?: string, body?: string): void;
    clear(toastId?: number, toastContainerId?: number): void;
}
export interface IClearWrapper {
    toastId?: number;
    toastContainerId?: number;
}
