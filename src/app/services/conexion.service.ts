import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators'


@Injectable({
  providedIn: 'root'
})
export class ConexionService {
 
  private _refresh$ = new Subject<void>()

  get refresh$(){
    return this._refresh$
  }


  url = "http://127.0.0.1:80" //Dirección backend
  constructor(public http: HttpClient) { }

  consultaDatos():Observable<any>{
    return this.http
    .get(this.url+"/consultaDatos")
  }

  createDatos(data): Observable<any>{
    return this.http
    .post(this.url+"/createDatos", JSON.stringify(data))
    .pipe(tap(() => {
      this._refresh$.next()
    }))
  }

  updateDatos(data): Observable<any>{
    return this.http
    .post(this.url+"/updateDatos", JSON.stringify(data))
    .pipe(tap(() => {
      this._refresh$.next()
    }))
  }

  removeDatos(data){
    return this.http
    .post(this.url+"/removeDatos", JSON.stringify(data))
    .pipe(tap(() => {
      this._refresh$.next()
    }))
  }
}
