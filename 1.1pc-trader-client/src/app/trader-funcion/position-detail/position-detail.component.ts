import { Component, OnInit, ElementRef,AfterViewInit,OnDestroy,ViewChild } from '@angular/core';
import { SocketIoService } from '../../socket.io.service';
import { HttpService } from '../../http.service';
import { ProcessFunService } from '../../comm-fun/process-fun.service';
import { SetSltpComponent } from '../set-sltp/set-sltp.component';
declare var Window;

@Component({
	selector: 'app-position-detail',
	templateUrl: './position-detail.component.html',
	styleUrls: ['./position-detail.component.css']
})
export class PositionDetailComponent implements OnInit,OnDestroy {

	@ViewChild(SetSltpComponent) setTplc:SetSltpComponent;
	connect;
	constructor(private ProcessFunService:ProcessFunService,private _http:HttpService,private _socket:SocketIoService,private el:ElementRef) {
		//
	}
	/* 持仓列表 */
	positionList:Array<any> = [];
	positionListJson = {};
	ngOnInit() {
		this._socket.addPositionDetail();
		this.connect = this._socket.getPosition().subscribe(res => {
			let data = JSON.parse(res.toString());
			if(this.chooseProId == data.productId){
				this.setTplc.price = data.content[0].toNewPrice;
				this.choosePositionPrice = data.content[0].toNewPrice;
			}
			if(this.positionList.length == 0){
				this.positionList.push(data.productId);
			}
			else{
				if(this.positionList.indexOf(data.productId) == -1){
					this.positionList.push(data.productId);
				}
			}
			this.positionListJson[data.productId] = data.content;
		});
	}
	ngOnDestroy() {
		this._socket.rejucePositionDetail();
		this.connect.unsubscribe();
	}
	/* 平仓 */
	closePosition():void {
		if(this.choosePositionPositionId == '' || this.choosePositionIndex == -1){
			return;
		}
		let json = [
			{'name':'商品名称','value':this.choosePositionProName},
			{'name':'方向','value':(this.choosePositionDir == 1)?'买':'卖'},
			{'name':'待平手数','value':this.choosePositionVolume},
			{'name':'提示','value':'是否确认要平仓?','color':'c_red'}
		];
		let self = this;
		Window._confirm(json,function(){
			let body = {"orderRequestVIce":{"productId":self.chooseProId,"orderDirect":self.choosePositionDir,"positionId":self.choosePositionPositionId}}
			self._http.postJson('trade/position/close',body,function(res){
				self.choosePositionPositionId = '';
				self.choosePositionIndex = -1;
			});
		});
	}
	/* 防快捷操作 重复点击 遮罩 */
	optLoading:boolean = false;
	/* 快捷平仓 */
	quicklyClosePosition(){
		if(this.choosePositionPositionId == '' || this.choosePositionIndex == -1){
			return;
		}
		this.optLoading = true;
		let json = [
			{'name':'商品名称','value':this.choosePositionProName},
			{'name':'方向','value':(this.choosePositionDir == 1)?'买':'卖'},
			{'name':'待平手数','value':this.choosePositionVolume},
			{'name':'提示','value':'是否确认要平仓?','color':'c_red'}
		];
		let body = {"orderRequestVIce":{"productId":this.chooseProId,"orderDirect":this.choosePositionDir,"positionId":this.choosePositionPositionId}}
		let self = this;
		this._http.postJson('trade/position/close',body,function(res){
			setTimeout(()=>{
				self.optLoading = false;
				self.choosePositionPositionId = '';
				self.choosePositionIndex = -1;
			},1000);
		});
	}
	/* 快捷反手 */
	quicklyBankHandel(){
		if(this.choosePositionPositionId == '' || this.choosePositionIndex == -1){
			return;
		}
		this.optLoading = true;
		let body = {"orderRequestVIce":{"productId":this.chooseProId,"orderDirect":this.choosePositionDir,"positionId":this.choosePositionPositionId}}
		let self = this;
		this._http.postJson('trade/position/close',body,function(res){
			console.log(res);
			let userId = Window.userInfo.userId;
			let orderDirect = self.choosePositionDir*-1;
			let priceCondition = 1;
			let triggerPrice = 0;
			let orderVolume = self.choosePositionVolume;
			let orderPrice = 0;
			let body = {
				"orderCreateVIce": {
					"productId":self.chooseProId,
					"triggerPrice": triggerPrice,
					"priceCondition": priceCondition,
					"orderPrice": orderPrice,
					"orderDirect": orderDirect,
					"orderVolume": orderVolume,
					"userId": userId
				}
			};
			console.log(body);
			self._http.postJson('trade/order/create',body,function(res){
				setTimeout(()=>{
					self.choosePositionPositionId = '';
					self.choosePositionIndex = -1;
					self.optLoading = false;
				},1000);
			});
		});
	}
	/* 设置止盈/止损 */
	showWinLoss():void{
		this.choosePositionSl = this.positionListJson[this.chooseProId][this.choosePositionIndex].sl;
		this.choosePositionTp = this.positionListJson[this.chooseProId][this.choosePositionIndex].tp;
		if(this.choosePositionPositionId == '' || this.choosePositionIndex == -1){
			return;
		}
		else{
			this.setTplc.showWinLoss(
				this.choosePositionProName,
				this.choosePositionPrice,
				this.choosePositionPositionPrice,
				this.choosePositionVolume,
				this.choosePositionDir,
				this.chooseProId,
				this.choosePositionPositionId,
				this.choosePositionSl,
				this.choosePositionTp
			);
		}
	}
	/* 持仓产品选择 */
	chooseProId:string = '';
	choosePositionIndex:number = -1;
	choosePositionProName:string = '';
	choosePositionDir:number;
	choosePositionVolume:number;
	choosePositionPrice:number;
	choosePositionPositionPrice:number;
	choosePositionPositionId:string = '';
	choosePositionSl:number = 0;
	choosePositionTp:number = 0;

	positionChoose(id,index,proName,dir,vol,price,positionPrice,positionId,sl,tp):void {
		this.choosePositionProName = proName;
		this.choosePositionDir = dir;
		this.choosePositionVolume = vol;
		this.choosePositionPrice = price;
		this.choosePositionPositionPrice = positionPrice;
		this.choosePositionPositionId = positionId;
		this.choosePositionSl = sl;
		this.choosePositionTp = tp;
		if(this.chooseProId == id && this.choosePositionIndex == index){
			this.chooseProId = '';
			this.choosePositionIndex = -1;
		}
		else{
			this.chooseProId = id;
			this.choosePositionIndex = index;
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

}
