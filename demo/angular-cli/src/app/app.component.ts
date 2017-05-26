import { Component } from '@angular/core';
import { ToasterService, Toast } from 'angular2-toaster';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';

  constructor(private toasterService: ToasterService) { }

  ngAfterViewInit() {
    let toast: Toast = { 
      type: 'info', data: 1, 
      onHideCallback: (toast) => console.log(toast.data) };
    this.toasterService.pop(toast);
  }
}
