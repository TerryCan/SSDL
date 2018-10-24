import { Component, OnInit, OnDestroy,ChangeDetectorRef } from '@angular/core';
import { SocketIoService } from '../../socket.io.service';
import { HttpService } from '../../http.service';
import { ProcessFunService } from '../../comm-fun/process-fun.service';
import * as $ from "jquery";
declare var Window;
@Component({
	selector: 'app-trader',
	templateUrl: './trader.component.html',
	styleUrls: ['./trader.component.css']
})
export class TraderComponent implements OnInit,OnDestroy {
	/* 下单类型 */
	priceType:string = '1';
	/* 当前合约 */
	inputContract:string;
	/* 输出合约 */
	outputContract:string = '';
	/* 限价单 价格 */
	limitPrice:number = 0;
	/* 产品价格浮动倍数 */
	proFloat:number = 0;
	/* 买一 */
	buyOne:number = 0;
	/* 卖一 */
	sellOne:number = 0;
	/* 档位 */
	DW:number = 0;
	/* 限价最终计算价格 */
	limitTraderPrice:number = 0;
	/* 交易数量 */
	traderNum:number = 1;
	/* 交易提示标识 */
	traderTip:boolean = true;

	proList = Window.productList;
	connection;
	constructor(private _socket:SocketIoService,private ref: ChangeDetectorRef,private _http:HttpService,private ProcessFunService:ProcessFunService) {
		/* 更改合约 */
		Window.changeTraderContract = (id)=>{
			Window.nowProId = id;
			this.DW = 0;
			for(let i=0,r=this.proList.length;i<r;i++){
				if(this.proList[i].productId == id){
					this.inputContract = this.proList[i].productName;
					this.exportProPrice(id)
					break;
				}
			}
		}
		let self = this;
		$(document).bind('click',function(e){
			var target  = $(e.target);
			if(target.closest(".trader-list-choose").length == 0){
				self.showTraderChoose = false;
			}　　
		})
	}
	ngOnInit() {
		Window.changeTraderContract(Window.nowProId);
		let self = this;
		this.connection = this._socket.getPrice().subscribe(data => {
			let obj = JSON.parse(data.toString());
			if(Window.nowProId == obj.ProductId){
				self.limitPrice = obj.QLastPrice;
				self.changeChooseProInfo(obj.QBidPrice[0],obj.QAskPrice[0]);
			}
		});
	}
	ngOnDestroy() {
		this.connection.unsubscribe();
	}
	/* 计算限价单 最终价格 */
	changeChooseProInfo(buyOne=0,sellOne=0){
		this.limitTraderPrice = this.ProcessFunService.accAdd(this.limitPrice,this.ProcessFunService.accMul(this.proFloat,this.DW));
		if(this.DW != 0){
			this.buyOne = this.limitTraderPrice;
			this.sellOne = this.limitTraderPrice;
		}
		else{
			this.buyOne = buyOne;
			this.sellOne = sellOne;
		}
	}
	/* 匹配到商品 输出交易价格 */
	exportProPrice(id){
		for(let i=0,r=Window.marketList.length;i<r;i++){
			if(Window.marketList[i].productId == id){
				this.proFloat = Window.marketList[i].unionMinPrices;
				this.limitPrice = Window.marketList[i].QLastPrice;
				this.changeChooseProInfo(Window.marketList[i].QBidPrice,Window.marketList[i].QAskPrice);
				break;
			}
		}
		
	}
	/* 匹配合约 */
	matchContract(scroll = true,refreshEcharts = true){
		this.outputContract = '';
		$('#trader-list-choose li').removeClass('b_yellow');
		for(let i=0,r=this.proList.length;i<r;i++){
			if(this.proList[i].productName == this.inputContract || this.proList[i].productCode == this.inputContract){
				this.outputContract = this.proList[i].productId;
					if(refreshEcharts){
					/* 市场页面合约切换 */
					if(Window.nowTraderShow == 0){
						Window.changeMarketContract(this.outputContract);
					}
					/* 图表页面行情切换 */
					else{
						Window.nowProId = this.outputContract;
						this._socket.rejuceProList();
						this._socket.addSingleProList(Window.nowProId);
						Window.changeProEchartsShow();
					}
					this.exportProPrice(this.outputContract);
					this.DW = 0;
				}
			}
			if(this.inputContract != ''){
				if(this.proList[i].productName.indexOf(this.inputContract) != -1 || this.proList[i].productCode.indexOf(this.inputContract) != -1){
					$('#trader-list-choose li').eq(i).addClass('b_yellow');
				}
			}
		}
		if(this.outputContract == ''){
			if(Window.nowTraderShow == 0){
				Window.changeMarketContract(-1);
			}
		}
		if(scroll){
			if($("#trader-list-choose li.b_yellow:first").length > 0){
				$("#trader-list-choose").animate({scrollTop: $("#trader-list-choose li.b_yellow:first").position().top},100);
			}
		}
	}
	/* 合约列表显示 */
	public showTraderChoose:boolean = false;

	/* 交易复位 */
	reset(){
		this.DW = 0;
		this.exportProPrice(Window.nowProId);
	}
	/* 价格变动 */
	changeLimitPriceTime;
	changeLimitPrice(type){
		clearTimeout(this.changeLimitPriceTime);
		this.changeLimitPricedo(type);
		let self = this;
		this.changeLimitPriceTime = setInterval(()=>{
			this.changeLimitPricedo(type);
		},150);
	}
	changeLimitPricedo(type){
		(type == 1)?this.DW--:this.DW++;
		this.changeChooseProInfo();
	}
	clearChangeLimit(){
		clearTimeout(this.changeLimitPriceTime);
	}
	/* 合约下单提示 */
	traderWaring(diretcion){
		if(!this.inputContract){
			Window._alert('请先选择合约!');
		}
		if(this.traderNum < 1){
			Window._alert('交易数量不能小于1 !');
		}
		else{
			let self = this;
			let name = this.inputContract;
			let price = (this.priceType == '1')?'市价':this.limitTraderPrice;
			let handels = this.traderNum;
			let diret = (diretcion == 1)?'买':'卖';
			let json =  [
							{'name':'商品名称','value':name,'color':''},
							{'name':'交易价格','value':price,'color':''},
							{'name':'交易手数','value':handels,'color':''},
							{'name':'交易方向','value':diret,'color':''}
						];
			if(diretcion == 1 && this.DW > 0 && this.priceType == '0'){
				json.push({'name':'提示','value':'买价高于市场价,可能会按市价成交','color':'c_red'});
				Window._confirm(json,function(){
					self.traderContract(diretcion);
				});
			}
			else if(diretcion == -1 && this.DW < 0 && this.priceType == '0'){
				json.push({'name':'提示','value':'卖价低于市场价,可能会按市价成交','color':'c_red'});
				Window._confirm(json,function(){
					self.traderContract(diretcion);
				});
			}
			else if(this.traderTip){
				Window._confirm(json,function(){
					self.traderContract(diretcion);
				});
			}
			else{
				self.traderContract(diretcion);
			}
		}
	}
	/* 合约下单 */
	traderContract(diretcion){
		let userId = Window.userInfo.userId;
		let productId = Window.nowProId;
		let orderDirect = diretcion;
		let priceCondition = this.priceType;
		let triggerPrice = 0;
		let orderVolume = this.traderNum;
		let orderPrice = (this.priceType == '0')?this.limitTraderPrice:0;
		let body = {
			"orderCreateVIce": {
				"productId":productId,
				"triggerPrice": triggerPrice,
				"priceCondition": priceCondition,
				"orderPrice": orderPrice,
				"orderDirect": orderDirect,
				"orderVolume": orderVolume,
				"userId": userId
			}
		};
		this._http.postJson('trade/order/create',body,function(res){
			console.log(res);
		});
	}
}
