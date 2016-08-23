import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'trusted-html',
    template: `
        <div>Allow {{name}} to speak?</div>
        <div>
            <button (click)="onMicOpen.emit([uuid, true])">Open</button>
            <button (click)="onMicOpen.emit([uuid, false])">Close</button>
        </div>`
})
export class TestComponent4 {
    @Input() name: string;
    @Input() uuid: string;
    @Output() onMicOpen: EventEmitter<any> = new EventEmitter();
}