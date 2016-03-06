import {Injectable, Output, EventEmitter, Optional} from 'angular2/core';
import {Toast} from './toast';

@Injectable()
export class ToasterService {
    private isAsync : boolean = true;
    
    constructor(@Optional() isAsync?: boolean) { 
        if (typeof isAsync === "boolean") {
            this.isAsync = isAsync;
        } 
        
        this.addToast = new EventEmitter<Toast>(this.isAsync);
        this.clearToasts = new EventEmitter(this.isAsync);
    }
    
    @Output()
    addToast: EventEmitter<Toast>;
    
    @Output()
    clearToasts: EventEmitter<IClearWrapper>;
    
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