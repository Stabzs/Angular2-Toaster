import { Component, OnInit } from '@angular/core';
import { ToasterConfig, IToasterConfig } from '@angular2-toaster/angular2-toaster';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

    constructor() { console.log('layout constructor called') }

    layoutConfig: IToasterConfig = new ToasterConfig({
        animation: 'fade', newestOnTop: false, 
        positionClass: 'toast-top-right', toastContainerId: 2,
        timeout: 0
    });

    ngOnInit() {}
}
