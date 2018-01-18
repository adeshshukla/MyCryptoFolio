import { Injectable } from '@angular/core';
import { Observable, ObservableInput } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/finally';
import { Http, XHRBackend, RequestOptions, Request, RequestOptionsArgs, Response, Headers } from '@angular/http';
import { LoaderService } from "./loader/loader.service";

@Injectable()
export class HttpService extends Http {
    constructor(backend: XHRBackend, defaultOptions: RequestOptions, private loaderService: LoaderService) {
        super(backend, defaultOptions);
    }

    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.request(url, options));
    }

    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.get(url, options));
    }

    post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.post(url, body, this.getRequestOptionArgs(options)));
    }

    put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.put(url, body, this.getRequestOptionArgs(options)));
    }

    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.delete(url, options));
    }

    getRequestOptionArgs(options?: RequestOptionsArgs): RequestOptionsArgs {
        return options;
    }

    intercept(observable: Observable<Response>): Observable<Response> {
        // console.log("In the intercept routine..");
        // Show loader.
        this.loaderService.show();

        return observable
            .catch(this.onCatch)
            .do(this.onSuccess, this.onError)
            .finally(() => {
                var that = this;
                setTimeout(() => {
                    // console.log("Loader hidden......");
                    that.loaderService.hide();
                }, 500);
            });
    }

    private onCatch(err, source) {
        console.log("Caught exception: " + err);
        return source;
    }

    private onSuccess(res) {
        // console.log('Request Success...!!!');
        // console.log("Response: " + res);
    }

    private onError(err) {
        console.log("Caught error: " + err);
    }
}