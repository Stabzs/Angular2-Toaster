import {BodyOutputType} from './src/bodyOutputType';
import {Toast} from './src/toast';
import {ToasterContainerComponent} from './src/toaster-container.component';
import {ToasterService} from './src/toaster.service';
import {ToasterConfig} from './src/toaster-config';


export * from './src/bodyOutputType';
export * from './src/toast';
export * from './src/toaster-config';
export * from './src/toaster-container.component';
export * from './src/toaster.service'; 

export default {
    providers: [ToasterService],
    directives: [ToasterContainerComponent] 
}