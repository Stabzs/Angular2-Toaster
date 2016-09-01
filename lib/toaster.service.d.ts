import { Toast } from './toast';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/share';
export declare class ToasterService {
    addToast: Observable<Toast>;
    private _addToast;
    clearToasts: Observable<IClearWrapper>;
    private _clearToasts;
    /**
     * Creates an instance of ToasterService.
     */
    constructor();
    /**
     * Synchronously create and show a new toast instance.
     *
     * @param {(string | Toast)} type The type of the toast, or a Toast object.
     * @param {string=} title The toast title.
     * @param {string=} body The toast body.
     * @returns {Toast}
     *          The newly created Toast instance with a randomly generated GUID Id.
     */
    pop(type: string | Toast, title?: string, body?: string): Toast;
    /**
     * Asynchronously create and show a new toast instance.
     *
     * @param {(string | Toast)} type The type of the toast, or a Toast object.
     * @param {string=} title The toast title.
     * @param {string=} body The toast body.
     * @returns {Observable<Toast>}
     *          A hot Observable that can be subscribed to in order to receive the Toast instance
     *          with a randomly generated GUID Id.
     */
    popAsync(type: string | Toast, title?: string, body?: string): Observable<Toast>;
    /**
     * Clears a toast by toastId and/or toastContainerId.
     *
     * @param {string} toastId The toastId to clear.
     * @param {number=} toastContainerId
     *        The toastContainerId of the container to remove toasts from.
     */
    clear(toastId?: string, toastContainerId?: number): void;
}
export interface IClearWrapper {
    toastId?: string;
    toastContainerId?: number;
}
