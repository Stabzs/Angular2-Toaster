import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import { SharedModule } from "./shared/shared.module";
import { AppComponent } from './app.component';
import { RoutesModule } from "./routes/routes.module";
import { LayoutModule } from "./layout/layout.module";
import { ToasterModule } from '@angular2-toaster/angular2-toaster';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    LayoutModule,
    ToasterModule.forRoot(),
    SharedModule.forRoot(),
    RoutesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
