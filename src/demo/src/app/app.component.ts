import { Component } from '@angular/core';
import { 
  ToasterConfig, IToasterConfig, ToasterService, Toast
} from '../../../angular2-toaster/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'demo';

  appConfig: IToasterConfig = new ToasterConfig({
    animation: 'fade', newestOnTop: true, positionClass: 'toast-bottom-right', 
    toastContainerId: 1, timeout: 0, showCloseButton: true, 
    // titleClass: 'title-1'
  });

  constructor (public toasterService: ToasterService) { }

  popToast() {
    let toast = this.toasterService.pop({
      type: 'success', 
      title: 'Home Title', 
      body: 'Home Body'
    });

    window.setTimeout(() => toast.title = 'Updated Home Title', 1000)
  }

  persistentToast() {
    this.toasterService.pop({
      type: 'success', 
      title: 'Click Me', 
      body: 'I am sticky with a really long body let us see what happens',
      tapToDismiss: false,
      onClickCallback: (t) => console.log(t.toastId),
      showCloseButton: true
    });
  }

  ngAfterViewInit() {
    console.log('entering view init');
    const toast: Toast = {
      type: 'info',
      body: 'I am init toast'
    };
    this.toasterService.pop(toast);
  }

  toto() {
    console.log('todo button clicked');
    const toast: Toast = {
      type: 'success',
      body: 'I am todo toast'
    };
    this.toasterService.pop(toast);
  }
}
