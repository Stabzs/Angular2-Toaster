import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
    name: 'trustHtml',
    pure: true
})
export class TrustHtmlPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {
    }

    transform(content: any): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(content);
    }
}
