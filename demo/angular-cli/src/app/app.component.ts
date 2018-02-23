import { Component } from '@angular/core';
import { ToasterConfig, IToasterConfig } from '@angular2-toaster/angular2-toaster';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent { 
  appConfig: IToasterConfig = new ToasterConfig({
    animation: 'fade', newestOnTop: false, positionClass: 'toast-top-left', 
    toastContainerId: 1, timeout: 0, showCloseButton: true, 
    titleClass: 'title-1'
  });
}
