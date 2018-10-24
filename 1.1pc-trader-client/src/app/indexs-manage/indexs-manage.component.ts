import { Component, OnInit,ElementRef } from '@angular/core';
import { HttpService } from '../http.service';
/* http request */
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
/****/

declare var Window,CodeMirror;
@Component({
	selector: 'app-indexs-manage',
	templateUrl: './indexs-manage.component.html',
	styleUrls: ['./indexs-manage.component.css']
})
export class IndexsManageComponent implements OnInit {

	constructor(public http: Http,private _http:HttpService,private el:ElementRef,) { }

	formulaManagement;
	formulaBaseCode;
	myCodeMirror;

	public isShowIndexsManage:boolean = false;

	ngOnInit() {
		/* 读取基本指标目录与公式 */
		let self = this;
		this.http.get("assets/json/formulaManagement.json").toPromise()
		.then(function(Response){
			let data = JSON.parse((<any>Response)._body);
			Window.formulaManagement = data;
			self.formulaManagement = data;
		});
		this.http.get("assets/json/formulaBaseCode.json").toPromise()
		.then(function(Response){
			let data = JSON.parse((<any>Response)._body);
			Window.formulaBaseCode = data;
			self.formulaBaseCode = data;
		});
		this.myCodeMirror = CodeMirror(this.el.nativeElement.querySelector('#indexsCode'), {
			value: "",
			mode:  "javascript",
			matchBrackets: true,
			lineNumbers: true,
			styleActiveLine: true,
			lineWrapping: true
		});
		this.myCodeMirror.setSize('auto','180px');
	}
	/* 指标选取 */
	c_index:string = '';
	isEditIndexs:boolean = false;
	currentEditIndexs = {
		"id":"",
		"name":"",
		"sub_name":"",
		"code":"",
		"attr":"",
		"des":"",
		"data":[]
	};
	clearIndex():void {
		this.c_index = '';
		this.currentEditIndexs = {
			"id":"",
			"name":"",
			"sub_name":"",
			"code":"",
			"attr":"",
			"des":"",
			"data":[]
		};
	}
	getIndexs(zid):void {
		this.clearIndex();
		for(let i=0,r=this.formulaBaseCode.length;i<r;i++){
			if(this.formulaBaseCode[i].id == zid){
				this.c_index = zid;
				this.currentEditIndexs = this.formulaBaseCode[i];
				break;
			}
		}
	}
	toEditIndexs() {
		if(this.c_index != ''){
			this.isEditIndexs = true;
			setTimeout(()=>{
				this.myCodeMirror.setValue(this.currentEditIndexs.code);
			},50);
		}
	}
}
