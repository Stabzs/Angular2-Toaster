declare var require;

import 'reflect-metadata';
require('zone.js/dist/zone');
require('zone.js/dist/long-stack-trace-zone');
import {ToasterContainerComponent, ToasterService, ToasterConfig} from 'angular2-toaster/angular2-toaster';
import {Component} from '@angular/core';
import {FORM_PROVIDERS} from '@angular/common';
import {bootstrap} from '@angular/platform-browser-dynamic';

@Component({
  selector: 'app',
  providers: [FORM_PROVIDERS, ToasterService],
  directives: [ToasterContainerComponent],
  pipes: [],
  styles:[],
  template: `
    <main-header></main-header>
    <navigation></navigation>
    <div id="main" role="main">
        <sub-header></sub-header>
        
        <div id="content">
            <main></main>
        </div>
        
        <toaster-container></toaster-container>
        
        <input type="button" value="pop toast" (click)="popToast()" />
    </div>
  `
})
export class App {
    private toasterService: ToasterService;

    constructor(toasterService: ToasterService) {
        this.toasterService = toasterService;    
    }
    
    ngAfterViewInit() {
        this.toasterService.pop('success', 'Args Title', 'Args Body');
    }
    
    popToast() {
        this.toasterService.pop('info', 'Toast', 'Popped from click');
    }
}

bootstrap(App);