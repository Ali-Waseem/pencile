import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Canvas } from '../Model/canvas';
import { User } from '../Model/user';


@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  userData:User
  constructor(
    private http: HttpClient
  ) {

    this.userData = JSON.parse(localStorage.getItem("userData"))

  }


  saveData(body, callback) {

    this.http.put(`${environment.baseURL}user/${this.userData.id}.json`, body).toPromise().then((res) => {
      callback({ success: res })
    }).catch((err) => {
      callback({ error: err })
    })
  }

  getData(callback) {

    this.http.get(`${environment.baseURL}user/${this.userData.id}.json`).toPromise().then((res) => {
      callback({ success: res })
    }).catch((err) => {
      callback({ error: err })
    })
  }

  shareCanvas(body , callback){
    this.http.put(`${environment.baseURL}list/${this.userData.id}.json`, body).toPromise().then((res) => {
      callback({ success: res })
    }).catch((err) => {
      callback({ error: err })
    })
  }


}


