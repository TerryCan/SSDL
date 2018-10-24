import { Injectable } from '@angular/core';
import { Subject } from "rxjs/Subject";
import { Observable } from 'rxjs/Observable';
/* http request */
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
declare var Window;
/****/
@Injectable()
export class HttpService {

	constructor(public http: Http) {

	}
	postJson(url,body,callback,boolean=true){
		let baseUrl = localStorage.getItem('_http');
		let headers = new Headers();
		headers.append('X-Requested-With', 'XMLHttpRequest');
		let options = new RequestOptions({ headers: headers });
		let _that = this;
		this.http.post(baseUrl+url,body,options).toPromise()
		.then(function(Response){
			var data = JSON.parse((<any>Response)._body);
			if(data.code == '000000'){
				callback(data);
			}
			else{
				if(boolean){
					Window._alert(data.message);
				}
				else{
					callback(data);
				}
			}
		})
		.catch(err => {
			this.handleError(err);
		});
	}
	postForm(url,body,callback,boolean=true){
		let headers = new Headers();
		let baseUrl = localStorage.getItem('_http');
		let bodyJson = this.transformRequest(body);
		headers.append('Content-Type', 'application/x-www-form-urlencoded');
		headers.append('X-Requested-With', 'XMLHttpRequest');
		let options = new RequestOptions({ headers: headers });
		let _that = this;
		this.http.post(baseUrl+url,bodyJson,options).toPromise()
		.then(function(Response){
			var data = JSON.parse((<any>Response)._body);
			if(data.code == '000000'){
				callback(data);
			}
			else{
				if(boolean){
					Window._alert(data.message);
				}
				else{
					callback(data);
				}
			}
		})
		.catch(err => {
			if(boolean){
				this.handleError(err);
			}
			else{
				callback(err);
			}
		});
	}
	transformRequest(obj) {
		var str = [];
		for (var p in obj) {
			str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
		}
		return str.join("&");
	}
	private handleError(error: Response) {
		try{
			Window._alert(JSON.parse((<any>error)._body).message);
		}
		catch(e){}
	}
}
