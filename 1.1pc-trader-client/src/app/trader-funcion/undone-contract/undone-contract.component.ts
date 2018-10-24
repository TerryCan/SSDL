import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketIoService } from '../../socket.io.service';
import { HttpService } from '../../http.service';
declare var Window;
@Component({
	selector: 'app-undone-contract',
	templateUrl: './undone-contract.component.html',
	styleUrls: ['./undone-contract.component.css']
})
export class UndoneContractComponent implements OnInit,OnDestroy {

	constructor(private _http:HttpService,private _socket:SocketIoService) { }

	optLoading:boolean = false;
	localOrderId:string = '';
	private localOrderIndex:number = -1;

	private connect;
	/* 挂单列表 */
	undoneContractLsit:Array<any> = [];

	ngOnInit() {
		let body = {
			page:1,
			rows:999,
			order:'desc',
			sort:'createTime',
			search_IN_orderState:'[1,2,3,4,5,8,10,11,12,13,16,17]'
		}
		let self = this;
		this._http.postForm('trade/order/query/as/page',body,function(res){
			let data = JSON.parse(res.content);
			self.undoneContractLsit = data.content;
			console.log(self.undoneContractLsit);
			self.connect = self._socket.getOrderBack().subscribe(res => {
				let data = JSON.parse(res.toString()).content;
				var hasId = 0;
				var tmpState = data.orderState;
				for(var i=0,r=self.undoneContractLsit.length;i<r;i++){
					if(self.undoneContractLsit[i].localOrderNo == data.localOrderNo){
						if(tmpState == 0 || tmpState == 6 || tmpState == 7 || tmpState == 9 || tmpState == 14 || tmpState == 15){
							self.undoneContractLsit.splice(i,1);
						}
						else{
							self.undoneContractLsit[i] = data;
						}
						hasId = 1;
						break;
					}
				}
				if(hasId == 0 && tmpState != 0 && tmpState != 6 && tmpState != 7 && tmpState != 9 && tmpState != 14 && tmpState != 15){
					self.undoneContractLsit.unshift(data);
				}
			});
		});
	}
	ngOnDestroy() {
		this.connect.unsubscribe();
	}
	orderStateText(value){
		return Window.orderState[value].name;
	}
	localOrderChoose(localOrderId,id,index):void {
		if(this.localOrderId == localOrderId){
			this.localOrderId = '';
			this.localOrderIndex = -1;
		}
		else{
			this.localOrderId = localOrderId;
			this.localOrderIndex = index;
		}

		if(Window.nowProId != id){
			Window.changeTraderContract(id);
			/* 市场页面合约切换 */
			if(Window.nowTraderShow == 0){
				Window.changeMarketContract(id);
			}
			/* 图表页面行情切换 */
			else{
				this._socket.rejuceProList();
				this._socket.addSingleProList(id);
				Window.changeProEchartsShow();
			}
		}
	}
	removeContract():void {
		this.optLoading = true;
		let self = this;
		let body = {"orderRequestVIce":{"localOrderId":this.localOrderId}};
		this._http.postJson('trade/order/remove',body,function(res){
			self.localOrderId = '';
			self.localOrderIndex = -1;
			self.optLoading = false;
			Window._alert(res.message);
		});
	}
	removeAllContract():void {
		let self = this;
		let undoneContractLsitLen = this.undoneContractLsit.length;
		for(var i=0,r=undoneContractLsitLen;i<r;i++){
			this.optLoading = true;
			let body = {"orderRequestVIce":{"localOrderId":self.undoneContractLsit[i].localOrderId}};
			this._http.postJson('trade/order/remove',body,function(res){
				self.localOrderId = '';
				self.localOrderIndex = -1;
				self.optLoading = false;
				Window._alert(res.message);
			});
		}

	}
}
