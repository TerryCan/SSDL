import { Injectable } from '@angular/core';
/* http request */
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
declare var window,io,pako;
/****/

@Injectable()
export class ProcessFunService {

	constructor(public http: Http) { }
	
	timestampCoverHms(_date,type){
		var date = new Date(_date);
		var Y = date.getFullYear() + '-';
		var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
		var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
		var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
		var m = (date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
		var s_m = (date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes());
		var s = (date.getSeconds() <10 ? '0' + date.getSeconds() : date.getSeconds());
		switch(type){
			case 'ymd':
				return Y+M+D;
			case 'all':
				return Y+M+D+h+m+s;
			case 'm':
				return m;
			case 'h':
				return h;
			case 'hm':
				return h+s_m;
			default:
				return h+m+s;
		}
	}
	accAdd(arg1,arg2){
		var r1, r2, m, c;
	    try {
	        r1 = arg1.toString().split(".")[1].length;
	    }
	    catch (e) {
	        r1 = 0;
	    }
	    try {  
	        r2 = arg2.toString().split(".")[1].length;  
	    }  
	    catch (e) {  
	        r2 = 0;  
	    }  
	    c = Math.abs(r1 - r2);  
	    m = Math.pow(10, Math.max(r1, r2));  
	    if (c > 0) {  
	        var cm = Math.pow(10, c);  
	        if (r1 > r2) {  
	            arg1 = Number(arg1.toString().replace(".", ""));  
	            arg2 = Number(arg2.toString().replace(".", "")) * cm;  
	        } else {  
	            arg1 = Number(arg1.toString().replace(".", "")) * cm;  
	            arg2 = Number(arg2.toString().replace(".", ""));  
	        }  
	    } else {  
	        arg1 = Number(arg1.toString().replace(".", ""));  
	        arg2 = Number(arg2.toString().replace(".", ""));
	    }
	    return (arg1 + arg2) / m;
	}
	accMul(arg1, arg2) {  
	    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();  
	    try {  
	        m += s1.split(".")[1].length;  
	    }  
	    catch (e) {  
	    }  
	    try {  
	        m += s2.split(".")[1].length;  
	    }  
	    catch (e) {  
	    }  
	    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);  
	}
}
