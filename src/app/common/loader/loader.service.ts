import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { LoaderState } from './loader';

@Injectable()
export class LoaderService {
    private loaderSubject = new Subject<LoaderState>();
    loaderState = this.loaderSubject.asObservable();
    constructor() { }
    show() {
        // console.log('Loader service show()');
        this.loaderSubject.next(<LoaderState>{ show: true });
    }
    hide() {
        // console.log('Loader service hide()');
        this.loaderSubject.next(<LoaderState>{ show: false });
    }
}