import {Injectable} from '@angular/core';
import {Toast} from './toast';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/share';
import {Observer} from 'rxjs/Observer';


@Injectable()
export class ToasterService {
    addToast: Observable<Toast>;
    private _addToast: Observer<Toast>;

    clearToasts: Observable<IClearWrapper>;
    private _clearToasts: Observer<IClearWrapper>;

    constructor() {
        this.addToast = new Observable<Toast>(observer => this._addToast = observer).share();
        this.clearToasts = new Observable<IClearWrapper>(observer => this._clearToasts = observer).share();
    }

    pop(type: string | Toast, title?: string, body?: string): Toast {
        let toast = typeof type === 'string' ? { type: type, title: title, body: body } : type;

        toast.toastId = Guid.newGuid();

        if (!this._addToast) {
            throw new Error("No Toaster Containers have been initialized to receive toasts.");
        }
        
        this._addToast.next(toast);
        return toast;
    }

    popAsync(type: string | Toast, title?: string, body?: string): Observable<Toast> {
        setTimeout(() => {
            this.pop(type, title, body);
        }, 0);

        return this.addToast;
    }

    clear(toastId?: string, toastContainerId?: number) {
        let clearWrapper: IClearWrapper = {
            toastId: toastId, toastContainerId: toastContainerId
        };

        this._clearToasts.next(clearWrapper)
    }
}

export interface IClearWrapper {
    toastId?: string;
    toastContainerId?: number;
}

// http://stackoverflow.com/questions/26501688/a-typescript-guid-class
class Guid {
    static newGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }
}