import { Injectable } from '@angular/core';
import { Pays } from '../entites/Pays';
import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import 'firebase/firestore';
@Injectable({
  providedIn: 'root'
})
export class PaysService {

  public server = 'https://restcountries.eu/rest/v2/';
  public allCtryapiUrl = 'all?fields=name;callingCodes;alpha3Code;flag';
  public allUrl = this.server + this.allCtryapiUrl;
  public allCountries: Array<Pays>;

  constructor(private http: HttpClient) { 
    this.allCountries = new Array();

  }

  public getAll<T>(): Observable<T> {
    return this.http.get<T>(this.allUrl);
}

public getSingle<T>(id: number): Observable<T> {
    return this.http.get<T>(this.allUrl + id);
}

}
@Injectable()
export class CustomInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!req.headers.has('Content-Type')) {
            req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
        }

        req = req.clone({ headers: req.headers.set('Accept', 'application/json') });
        return next.handle(req);
    }
}
