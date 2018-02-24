import { Component } from '@angular/core';
import { ToasterService, IToasterConfig, ToasterConfig } from '@angular2-toaster/angular2-toaster';

@Component({
  selector: 'app-root',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  title = 'home';

  constructor(public toasterService: ToasterService) {}

  homeConfig: IToasterConfig = new ToasterConfig({
    animation: 'fade', newestOnTop: false, 
    positionClass: 'toast-bottom-center', toastContainerId: 4
  });

  popToast() {
    let toast = this.toasterService.pop({
      type: 'success', 
      title: 'Home Title', 
      body: 'Home Body'
    });

    window.setTimeout(() => toast.title = 'Updated Home Title', 1000)
  }
}
