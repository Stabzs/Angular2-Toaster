import {Injectable, Output, EventEmitter} from 'angular2/core';
import {Toast} from './toast';

@Injectable()
export class ToasterService {
    
    @Output()
    addToast: EventEmitter<Toast> = new EventEmitter<Toast>();
    
    @Output()
    clearToasts: EventEmitter<IClearWrapper> = new EventEmitter();
    
    pop(type: string|Toast, title?: string, body?: string) {
        let toast = typeof type === 'string' ? { type: type, title: title, body: body } : type;
        this.addToast.emit(toast);
        // TODO: Return toast id
    }
    
    clear(toastId?: number, toastContainerId?: number) {
        let clearWrapper : IClearWrapper = {
            toastId: toastId, toastContainerId: toastContainerId
        };
        
        this.clearToasts.emit(clearWrapper)
    }
}

export interface IClearWrapper {
    toastId?: number;
    toastContainerId?: number;
}