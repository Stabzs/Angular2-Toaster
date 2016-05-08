import 'reflect-metadata';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
export declare class App {
    private toasterService;
    constructor(toasterService: ToasterService);
    ngAfterViewInit(): void;
    popToast(): void;
}
