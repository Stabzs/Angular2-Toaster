import {ToasterContainerComponent, ToasterService, ToasterConfig} from 'angular2-toaster/angular2-toaster';
import {Component} from 'angular2/core';
import {FORM_PROVIDERS} from 'angular2/common';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {bootstrap} from 'angular2/platform/browser'

@Component({
  selector: 'app',
  providers: [FORM_PROVIDERS, ToasterService],
  directives: [ROUTER_DIRECTIVES, ToasterContainerComponent ],
  pipes: [],
  styles:[],
  template: `
    <main-header></main-header>
    <navigation></navigation>
    <div id="main" role="main">
        <sub-header></sub-header>
        
        <div id="content">
            <main>
                <!--<router-outlet></router-outlet>-->
            </main>
        </div>
        
        <toaster-container></toaster-container>
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
}

bootstrap(App);