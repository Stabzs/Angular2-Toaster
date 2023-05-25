import {
    Component, 
    Input, 
    Output, 
    ViewChild, 
    ViewContainerRef, 
    EventEmitter,
    ComponentFactoryResolver, 
    ChangeDetectorRef, 
    OnInit, 
    AfterViewInit, 
    OnDestroy,
    HostListener,
    NgZone, 
    ElementRef,
    Renderer2
} from '@angular/core';
import { Toast } from './toast';
import { BodyOutputType } from './bodyOutputType';
import { ToasterConfig } from './toaster-config';

@Component({
    selector: '[toastComp]',
    template: `
        <div class="toast-content">
            <div [ngClass]="titleClass">{{toast.title}}</div>
            <div [ngClass]="messageClass" [ngSwitch]="toast.bodyOutputType">
                <div *ngSwitchCase="bodyOutputType.Component" #componentBody></div>
                <div *ngSwitchCase="bodyOutputType.TrustedHtml" [innerHTML]="(toast.body ?? '') | trustHtml"></div>
                <div *ngSwitchCase="bodyOutputType.Default">{{toast.body ?? ''}}</div>
            </div>
        </div>
        <button class="toast-close-button" *ngIf="toast.showCloseButton" (click)="click($event, toast)"
            [innerHTML]="(toast.closeHtml ?? '') | trustHtml">
        </button>
        <div *ngIf="toast.progressBar">
            <div class="toast-progress-bar" [style.width]="progressBarWidth + '%'"></div>
        </div>`
})
export class ToastComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() toasterconfig: ToasterConfig;
    @Input() toast: Toast;
    @Input() titleClass: string;
    @Input() messageClass: string;
    @ViewChild('componentBody', { read: ViewContainerRef, static: false }) componentBody: ViewContainerRef;

    public progressBarWidth: number = -1;
    public bodyOutputType = BodyOutputType;

    @Output()
    public clickEvent = new EventEmitter();
    @Output()
    public removeToastEvent = new EventEmitter<Toast>();

    private timeoutId?: number = null;
    private timeout: number = 0;
    private progressBarIntervalId?: number = null;
    private removeToastTick: number;

    private removeMouseOverListener: () => void;

    constructor(
      private componentFactoryResolver: ComponentFactoryResolver,
      private changeDetectorRef: ChangeDetectorRef,
      private ngZone: NgZone,
      private element: ElementRef,
      private renderer2: Renderer2
    ) {}

    ngOnInit() {
        if (this.toast.progressBar) {
            this.toast.progressBarDirection = this.toast.progressBarDirection || 'decreasing';
        }

        let timeout = (typeof this.toast.timeout === 'number')
            ? this.toast.timeout : this.toasterconfig.timeout;

        if (typeof timeout === 'object') { 
            timeout = timeout[this.toast.type]; 
        };

        this.timeout = timeout;
    }

    ngAfterViewInit() {
        if (this.toast.bodyOutputType === this.bodyOutputType.Component) {
            const component = this.componentFactoryResolver.resolveComponentFactory(this.toast.body);
            const componentInstance: any = this.componentBody.createComponent(component, undefined, this.componentBody.injector);
            componentInstance.instance.toast = this.toast;
            this.changeDetectorRef.detectChanges();
        }

        if (this.toasterconfig.mouseoverTimerStop) {
            // only apply a mouseenter event when necessary to avoid
            // unnecessary event and change detection cycles.
            this.removeMouseOverListener = this.renderer2.listen(
                this.element.nativeElement, 
                'mouseenter', 
                () => this.stopTimer()
            );
        }

        this.configureTimer();
    }

    click(event: MouseEvent, toast: Toast) {
        event.stopPropagation();
        this.clickEvent.emit({ value : { toast: toast, isCloseButton: true } });
    }

    stopTimer() {
        this.progressBarWidth = 0;
        this.clearTimers();
    }

    @HostListener('mouseleave') 
    restartTimer() {
        if (this.toasterconfig.mouseoverTimerStop) {
            if (!this.timeoutId) {
                this.configureTimer();
            }
        } else if (this.timeout && !this.timeoutId) {
            this.removeToast();
        }
    }

    ngOnDestroy() {
        if (this.removeMouseOverListener) {
            this.removeMouseOverListener();
        }
        this.clearTimers();
    }

    private configureTimer() {
        if (!this.timeout || this.timeout < 1) {
            return;
        }

        if (this.toast.progressBar) {
            this.removeToastTick = new Date().getTime() + this.timeout;
            this.progressBarWidth = -1;
        } 
        
        this.ngZone.runOutsideAngular(() => {
            this.timeoutId = window.setTimeout(() => {
                this.ngZone.run(() => {
                    this.changeDetectorRef.markForCheck();
                    this.removeToast();
                });
            }, this.timeout);

            if (this.toast.progressBar) {
                this.progressBarIntervalId = window.setInterval(() => {
                    this.ngZone.run(() => {
                        this.updateProgressBar();
                    });
                }, 10);
            }
        });
    }

    private updateProgressBar() {
        if (this.progressBarWidth === 0 || this.progressBarWidth === 100) {
          return;
        }

        this.progressBarWidth = ((this.removeToastTick - new Date().getTime()) / this.timeout) * 100;
        
        if (this.toast.progressBarDirection === 'increasing') {
          this.progressBarWidth = 100 - this.progressBarWidth;
        }
        if (this.progressBarWidth < 0) {
          this.progressBarWidth = 0;
        }
        if (this.progressBarWidth > 100) {
          this.progressBarWidth = 100;
        }
    }

    private clearTimers() {
        if (this.timeoutId) {
            window.clearTimeout(this.timeoutId)
        }

        if (this.progressBarIntervalId) {
            window.clearInterval(this.progressBarIntervalId);
        }

        this.timeoutId = null;
        this.progressBarIntervalId = null;
    }

    private removeToast() {
        this.removeToastEvent.emit(this.toast);
    }
}
