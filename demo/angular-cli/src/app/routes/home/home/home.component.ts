import { Component, AfterViewInit } from '@angular/core';
import { ToasterService, IToasterConfig, ToasterConfig, Toast } from '@angular2-toaster/angular2-toaster';

@Component({
  selector: 'app-root',
  templateUrl: './home.component.html',
})
export class HomeComponent implements AfterViewInit {
  title = 'home';

  constructor(public toasterService: ToasterService) {}

  homeConfig: IToasterConfig = new ToasterConfig({
    animation: 'fade', 
    newestOnTop: false, 
    positionClass: 'toast-bottom-center', 
    toastContainerId: 4
  });

  popToast() {
    let toast = this.toasterService.pop({
      type: 'success', 
      title: 'Home Title', 
      body: 'Home Body'
    });

    window.setTimeout(() => toast.title = 'Updated Home Title', 1000)
  }

  ngAfterViewInit() {
    console.log('entering view init');
    const toast: Toast = {
      type: 'success',
      body: 'I am init toast'
    };
    this.toasterService.pop(toast);
  }

  toto() {
    console.log('toto button clicked');
    const toast: Toast = {
      type: 'success',
      body: 'I am toto toast'
    };
    this.toasterService.pop(toast);
  }
}
