declare var require;
import 'reflect-metadata';
require('zone.js/dist/zone');
require('zone.js/dist/long-stack-trace-zone');


import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {NgModule, Component} from '@angular/core';
import {ToastModule, ToasterContainerComponent, ToasterService, ToasterConfig} from 'angular2-toaster/angular2-toaster';
import {BrowserModule} from '@angular/platform-browser';
import {FORM_PROVIDERS} from '@angular/common';

@Component({
  selector: 'app',
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

@NgModule({
    declarations: [TestComponent, App],
    bootstrap: [App],
    imports: [BrowserModule, ToastModule]
})
export class Module {}

platformBrowserDynamic().bootstrapModule(Module)