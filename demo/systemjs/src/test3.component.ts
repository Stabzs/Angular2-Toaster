import {Component} from '@angular/core';

@Component({
    selector: 'action-component',
    template: `
        <div>Stabzs wants to speak.  Open Mic?</div>
        <div>Mic is {{micStatus ? 'Open' : 'Closed'}}
        <div>
            <button (click)="open()">Open</button>
            <button (click)="close()">Close</button>
        </div>`
})
export class TestComponent3 {
    public micStatus: boolean = false;
    open() { this.micStatus = true; }
    close() { this.micStatus = false; }
}