import { Injectable } from '@angular/core';
/* http request */
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
declare var Window,io;
/****/

@Injectable()
export class SocketIoService {

	constructor(public http: Http) {
		Window.WifiStatus = function(){};
	}

	creatNewSocket(callback){
		/* 获取socket token */
		let baseUrl = localStorage.getItem('_http');
		let baseSocket = localStorage.getItem('_socket');
		let self = this;
		this.http.get(baseUrl + "socket.io/get/tonken").toPromise()
		.then(function(Response){
			Window.token = JSON.parse((<any>Response)._body).content;
			Window.socket = io(baseSocket,{query:{tonken:Window.token},autoConnect: false});
			Window.socket.open();
			Window.socket.on("reconnect", function(num) {
				Window.WifiStatus("reconnect");
				console.log("reconnect")
				setTimeout(()=>{
					if(self._addProList){
						self.addProList();
					}
					if(self._addSingleProList){
						self.addSingleProList(Window.nowProId);
					}
					if(self._addPersonalGold){
						self.addPersonalGold();
						self.addPosition();
						self.addPositionDetail();
					}
				},2000);
			});
			Window.socket.on("connect", function(num) {
				console.log("connect");
				Window.WifiStatus("connect");
				Window.isConnect = true;
				if(self._addProList){
					self.addProList();
				}
				if(self._addSingleProList){
					self.addSingleProList(Window.nowProId);
				}
				if(self._addPersonalGold){
					self.addPersonalGold();
					self.addPosition();
					self.addPositionDetail();
				}
			});
			Window.socket.on("disconnect", function(num) {
				Window.WifiStatus("disconnect");
				console.log("disconnect");
				Window.isConnect = false;
				if(Window.openReconnect){
					self.reconnect();
				}
			});
			callback();
		});
	}
	reconnect() {
		let baseUrl = localStorage.getItem('_http');
		let self = this;
		self.http.get(baseUrl + "socket.io/get/tonken").toPromise()
		.then(function(Response){
			Window.socket.io.opts.query.tonken = Window.token;
			Window.socket.open();
		})
		.catch(function(){
			setTimeout(()=>{
				self.reconnect();
			},2000);
		});
	}
	getPrice() {
		let observable = new Observable(observer => {
			Window.socket.on('publish-price',(data) => {
				observer.next(data);
			})
		})
		return observable;
	}
	getOrderBack() {
		let observable = new Observable(observer => {
			Window.socket.on('publish-order',(data) => {
				observer.next(data);
			})
		})
		return observable;
	}
	getAccount() {
		let observable = new Observable(observer => {
			Window.socket.on('publish-account',(data) => {
				observer.next(data);
			})
		})
		return observable;
	}
	getPositionTotal() {
		let observable = new Observable(observer => {
			Window.socket.on('publish-position-total',(data) => {
				observer.next(data);
			})
		})
		return observable;
	}
	getPosition() {
		let observable = new Observable(observer => {
			Window.socket.on('publish-position',(data) => {
				observer.next(data);
			})
		})
		return observable;
	}
	getNotice() {
		let observable = new Observable(observer => {
			Window.socket.on('publish-notice-content',(data) => {
				observer.next(data);
			})
		})
		return observable;
	}
	private _addProList:boolean;
	private _addSingleProList:boolean;
	private _addPersonalGold:boolean;

	/* 订阅产品 */
	addProList(){
		this._addProList = true;
		Window.socket.emit("subscribe-price",Window.productIdListScroll);
	}
	/* 订阅单个产品 */
	addSingleProList(id){
		this._addSingleProList = true;
		Window.socket.emit("subscribe-price",[id]);
	}
	/* 退订所有产品 */
	rejuceProList(){
		this._addProList = false;
		this._addSingleProList = false;
		Window.socket.emit("unsubscribe-price",Window.productIdList);
	}
	/* 订阅个人资金 委托 */
	addPersonalGold(){
		this._addPersonalGold = true;
		Window.socket.emit("subscribe-pub-privacy-info",["publish-account","publish-order"]);
	}
	/* 退订个人资金 委托*/
	rejucePersonalGold(){
		this._addPersonalGold = false;
		Window.socket.emit("unsubscribe-pub-privacy-info",["publish-account","publish-order"]);
	}
	/* 订阅持仓 */
	addPosition(){
		Window.socket.emit("subscribe-pub-privacy-info",["publish-position-total"]);
	}
	/* 退订持仓 */
	rejucePosition(){
		Window.socket.emit("unsubscribe-pub-privacy-info",["publish-position-total"]);
	}
	/* 订阅持仓明细 */
	addPositionDetail(){
		Window.socket.emit("subscribe-pub-privacy-info",["publish-position"]);
	}
	/* 退订持仓明细 */
	rejucePositionDetail(){
		Window.socket.emit("unsubscribe-pub-privacy-info",["publish-position"]);
	}
	/* 订阅所有信息 */
	subscribeAll(){
		this._addProList = true;
		this._addSingleProList = true;
		this._addPersonalGold = true;
		Window.socket.emit("subscribe-price",Window.productIdList);
		Window.socket.emit("subscribe-pub-privacy-info",["publish-account"]);
		Window.socket.emit("subscribe-pub-privacy-info",["publish-position-total"]);
		Window.socket.emit("subscribe-pub-privacy-info",["publish-order"]);
		Window.socket.emit("subscribe-pub-privacy-info",["publish-position"]);
	}
	/* 退订所有信息 */
	destoryAll(){
		this._addProList = false;
		this._addSingleProList = false;
		this._addPersonalGold = false;
		Window.socket.emit("unsubscribe-price",Window.productIdList);
		Window.socket.emit("unsubscribe-pub-privacy-info",["publish-account"]);
		Window.socket.emit("unsubscribe-pub-privacy-info",["publish-position-total"]);
		Window.socket.emit("unsubscribe-pub-privacy-info",["publish-order"]);
		Window.socket.emit("unsubscribe-pub-privacy-info",["publish-position"]);
	}
}
