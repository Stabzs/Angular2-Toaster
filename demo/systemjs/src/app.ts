import {NgModule} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {BrowserModule} from '@angular/platform-browser';
import {ToastModule} from 'angular2-toaster/lib/toast.module';

import {Root} from './root.component'
import {TestComponent} from './test.component'
import {TestComponent2} from './test2.component'
import {TestComponent3} from './test3.component'
import {TestComponent4} from './test4.component'

@NgModule({
    imports: [BrowserModule, ToastModule],
    declarations: [TestComponent, TestComponent2, TestComponent3, TestComponent4, Root],
    providers: [],
    bootstrap: [Root]
})
export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);