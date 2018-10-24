import { Component, OnInit, OnDestroy, EventEmitter, ViewChild, ChangeDetectorRef } from '@angular/core';
import { HttpService } from '../http.service';
import { SocketIoService } from '../socket.io.service';
import { ProcessFunService } from '../comm-fun/process-fun.service';
/* 分时图 */
import { LineMainComponent } from '../echarts/line-main/line-main.component';
import { LineVolComponent } from '../echarts/line-vol/line-vol.component';
/* 蜡烛图 */
import { CandelMainComponent } from '../echarts/candel-main/candel-main.component';
import { CandelVolComponent } from '../echarts/candel-vol/candel-vol.component';
import { CandelMacdComponent } from '../echarts/candel-macd/candel-macd.component';
declare var baseConfig,Window,echarts;
@Component({
	selector: 'app-echarts-draw',
	templateUrl: './echarts-draw.component.html',
	styleUrls: ['./echarts-draw.component.css']
})
export class EchartsDrawComponent implements OnInit,OnDestroy {

	@ViewChild(LineMainComponent)
	LineMain:LineMainComponent;
	@ViewChild(LineVolComponent)
	LineVol:LineVolComponent;

	@ViewChild(CandelMainComponent)
	CandelMain:CandelMainComponent;
	@ViewChild(CandelVolComponent)
	CandelVol:CandelVolComponent;
	@ViewChild(CandelMacdComponent)
	CandelMacd:CandelMacdComponent;

	constructor(private _socket:SocketIoService,private _http:HttpService,private ref: ChangeDetectorRef,private ProcessFunService:ProcessFunService) {
		window.onresize = () => {
			Window.allChartsResize();
		}
		Window.allChartsResize = ()=>{
			if(this.mainEchartType == 0){
				this.LineMain.resizeChart();
				this.LineVol.resizeChart();
			}
			else{
				this.CandelMain.resizeChart();
				this.CandelMacd.resizeChart();
				this.CandelVol.resizeChart();
			}
		}
		/* 移动基准 */
		Window.candelMoveStart = 80;
		Window.candelMoveEnd = 100;
		document.onkeydown = (e)=>{
			let keyNum = e.which;
			if(this.mainEchartType != 0){
				if(this.candelHasConnect == false){
					this.connectEcharts();
				}
				this.candelHasConnect = true;
				this.chartsMove(keyNum);
				this.chartsZoom(keyNum)
			}
			if(keyNum == 113){
				Window.showTrader()
			}
		}
		if(!Window.mainEchartType){
			Window.mainEchartType = 0;
		}
		Window.changeShowBS = (bool)=>{
			this.show_five = Window.ShowBS;
		}
	}
	/* 显示几手买卖 */
	public show_five = Window.ShowBS;
	chartsZoom(keyCode){
		if(keyCode == 38){
			if(Window.candelMoveStart >= 0 && Window.candelMoveEnd <= 100){
				if(Window.candelMoveStart < Window.candelMoveEnd - 5){
					Window.candelMoveStart += 5;
				}
			}
			Window.candel_ma.dispatchAction({
				type: 'dataZoom',
				start: Window.candelMoveStart,
	 			end: Window.candelMoveEnd
			});
		}
		else if(keyCode == 40){
			if(Window.candelMoveStart > 0 && Window.candelMoveEnd <= 100){
				Window.candelMoveStart -= 5;
			}
			else if(Window.candelMoveStart <= 0 && Window.candelMoveEnd <= 100){
				Window.candelMoveEnd += 5;
			}
			if(Window.candelMoveEnd > 100){
				Window.candelMoveEnd = 100;
			}
			if(Window.candelMoveStart < 0){
				Window.candelMoveStart = 0;
			}
			Window.candel_ma.dispatchAction({
				type: 'dataZoom',
				start: Window.candelMoveStart,
	 			end: Window.candelMoveEnd
			});
		}
	}
	chartsMove(keyCode){
		let baseMove = 0.20;
		if(keyCode == 37){
			var option = Window.candel_ma.getOption();
			if(Window.candelMoveStart > 0){
				Window.candelMoveStart -= baseMove;
				Window.candelMoveEnd -= baseMove;
				Window.candel_ma.dispatchAction({
					type: 'dataZoom',
					start: Window.candelMoveStart,
		 			end:Window.candelMoveEnd
				});
			}
		}
		else if(keyCode == 39){
			var option = Window.candel_ma.getOption();
			if(Window.candelMoveEnd < 100){
				Window.candelMoveStart += baseMove;
				Window.candelMoveEnd += baseMove;
				Window.candel_ma.dispatchAction({
					type: 'dataZoom',
					start: Window.candelMoveStart,
		 			end: Window.candelMoveEnd
				});
			}
		}
	}
	private connection;
	proId:string;
	/* 视图切换 0:实时行情 1:交易明细 */
	vc:number = 0;
	/* 主图切换 0:分时 1:蜡烛 */
	mainEchartType:number;
	proInfo = {
		"QLastPrice":'',
		"QChangeValue":'',
		"QPreClosingPrice":'',
		"QChangeRate":'',
		"QOpeningPrice":'',
		"QTotalQty":'',
		"QHighPrice":'',
		"QLastQty":'',
		"QLowPrice":'',
		"Stamp":'',
		"QAskPrice":[],
		"QAskQty":[],
		"QBidPrice":[],
		"QBidQty":[],
		"askW":[],
		"bidW":[],
		"productName":'-',
		"productCode":'-',
		"SignType":'',
		"SignTurnover":'',
		"SignStamp":'',
		"SignRecvCnt":'',
		"SignQty":'',
		"SignPriceOpen":'',
		"SignPriceMin":'',
		"SignPriceMax":'',
		"SignPriceClose":'',
		"SignChangeValue":'',
		"SignChangeRate":'',
		"QAveragePrice":'',
		"ProductId":''
	};

	refreshData:Array<any> = [];

	/* 是否显示图表十字坐标 */
	lineCross = false;
	candelCross = false;
	/* 交易明细 列表*/
	public traderDetailList:Array<any> = [];
	ngOnInit() {
		Window.CLOSE = [];//收盘价
		Window.__dates = [];//时间
		Window.__volumn = [];//成交量
		Window.__candel_data = [];//开收低高
		Window.__candel_settle_price = [];//结算价

		Window.__QLastPrice = [];//最近价
		Window.__QChangeRate = [];//涨幅
		Window.__QAveragePrice = [];//均价
		Window.__QOpeningPrice = [];//日开盘价
		Window.__SignQty = [];//分钟成交
		Window.__QPositionQty = [];//总持仓
		Window.__lineDates = [];//分钟时间
		Window.__hasValueData = null;

		this.proId = Window.nowProId;
		let self = this;
		for (let i=0,r=Window.marketList.length;i<r;i++) {
			if(Window.marketList[i].productId === self.proId){
				self.proInfo.productName = Window.marketList[i].productName;
				self.proInfo.productCode = Window.marketList[i].productCode;
			}
		}

		this._http.postJson('trade/price/cur/quote/qry',{"symbol":this.proId},function(data){

			self.proInfo.askW = self.calcuW(data.quote.QAskQty);
			self.proInfo.bidW = self.calcuW(data.quote.QBidQty);

			self.proInfo.QLastPrice = data.quote.QLastPrice;
			self.proInfo.QChangeValue = data.quote.QChangeValue;
			self.proInfo.QPreClosingPrice = data.quote.QPreClosingPrice;
			self.proInfo.QChangeRate = data.quote.QChangeRate;
			self.proInfo.QOpeningPrice = data.quote.QOpeningPrice;
			self.proInfo.QTotalQty = data.quote.QTotalQty;
			self.proInfo.QHighPrice = data.quote.QHighPrice;
			self.proInfo.QLastQty = data.quote.QLastQty;
			self.proInfo.QLowPrice = data.quote.QLowPrice;
			self.proInfo.Stamp = data.quote.Stamp;

			self.proInfo.QAskPrice = data.quote.QAskPrice;
			self.proInfo.QAskQty = data.quote.QAskQty;
			self.proInfo.QBidPrice = data.quote.QBidPrice;
			self.proInfo.QBidQty = data.quote.QBidQty;
		});

		this.connection = this._socket.getPrice().subscribe(data => {
			let nowInfo = JSON.parse(data.toString());
			if(nowInfo.ProductId == this.proId){
				self.proInfo.askW = [];
				self.proInfo.bidW = [];

				self.proInfo.askW = self.calcuW(nowInfo.QAskQty);
				self.proInfo.bidW = self.calcuW(nowInfo.QAskQty);

				self.proInfo.QLastPrice = nowInfo.QLastPrice;
				self.proInfo.QChangeValue = nowInfo.QChangeValue;
				self.proInfo.QPreClosingPrice = nowInfo.QPreClosingPrice;
				self.proInfo.QChangeRate = nowInfo.QChangeRate;
				self.proInfo.QOpeningPrice = nowInfo.QOpeningPrice;
				self.proInfo.QTotalQty = nowInfo.QTotalQty;
				self.proInfo.QHighPrice = nowInfo.QHighPrice;
				self.proInfo.QLastQty = nowInfo.QLastQty;
				self.proInfo.QLowPrice = nowInfo.QLowPrice;
				self.proInfo.Stamp = nowInfo.Stamp;

				self.proInfo.QAskPrice = nowInfo.QAskPrice;
				self.proInfo.QAskQty = nowInfo.QAskQty;
				self.proInfo.QBidPrice = nowInfo.QBidPrice;
				self.proInfo.QBidQty = nowInfo.QBidQty;

				self.proInfo.SignType = nowInfo.SignType;
				self.proInfo.SignTurnover = nowInfo.SignTurnover;
				self.proInfo.SignStamp = nowInfo.SignStamp;
				self.proInfo.SignRecvCnt = nowInfo.SignRecvCnt;
				self.proInfo.SignQty = nowInfo.SignQty;
				self.proInfo.SignPriceOpen = nowInfo.SignPriceOpen;
				self.proInfo.SignPriceMin = nowInfo.SignPriceMin;
				self.proInfo.SignPriceMax = nowInfo.SignPriceMax;
				self.proInfo.SignPriceClose = nowInfo.SignPriceClose;
				self.proInfo.SignChangeValue = nowInfo.SignChangeValue;
				self.proInfo.SignChangeRate = nowInfo.SignChangeRate;
				self.proInfo.QAveragePrice = nowInfo.QAveragePrice;
				self.proInfo.ProductId = nowInfo.ProductId;

				
				if(self.traderDetailList.length == 0){
					let DateTimeStamp = nowInfo.DateTimeStamp.split(' ');
					self.traderDetailList.unshift({"time":DateTimeStamp[1],"QLastPrice":nowInfo.QLastPrice,"QLastQty":nowInfo.QLastQty});
				}
				else{
					if(nowInfo.QLastPrice != self.traderDetailList[0].QLastPrice){
						if(self.traderDetailList.length > 40){
							self.traderDetailList.pop();
						}
						let DateTimeStamp = nowInfo.DateTimeStamp.split(' ');
						self.traderDetailList.unshift({"time":DateTimeStamp[1],"QLastPrice":nowInfo.QLastPrice,"QLastQty":nowInfo.QLastQty});
					}
				}

				/* 图表更新 */
				if(this.mainEchartType == 0){
					self.LineMain.drawEffect(self.proInfo);
					if(nowInfo.SignType == 1){
						Window.CLOSE.push(nowInfo.SignPriceClose);
						Window.__QChangeRate.push(nowInfo.QChangeRate);
						Window.__QAveragePrice.push(nowInfo.QAveragePrice);
						Window.__QOpeningPrice = nowInfo.QOpeningPrice;
						Window.__SignQty.push(nowInfo.SignQty);
						Window.__QPositionQty.push(nowInfo.QPositionQty);
						Window.__QLastPrice.push(nowInfo.QLastPrice);
						Window.__lineDates.splice(Window.__lineDataNum,1,self.ProcessFunService.timestampCoverHms((nowInfo.Stamp+60)*1000,'hm'));//分钟时间
						Window.__lineDataNum++;
						Window.__hasValueData = Window.__lineDates[Window.__lineDataNum];
						self.LineMain.update();
						self.LineVol.update();
					}
				}
				else{
					self.CandelMain.drawEffect(self.proInfo);
					if(nowInfo.SignType == this.mainEchartType){
						if(this.mainEchartType != 0){
							Window.CLOSE.shift();//收盘价
							Window.__dates.shift();//时间
							Window.__volumn.shift();//成交量
							Window.__candel_data.shift();//开收低高
							Window.__candel_settle_price.shift();

							Window.CLOSE.push(nowInfo.SignPriceClose);
							Window.__volumn.push(nowInfo.SignQty);
							Window.__candel_settle_price.push('-');
							Window.__candel_settle_price.splice(-2,1,nowInfo.QPreSettlePrice);
							Window.__candel_data.push([Window.__candel_data[Window.__candel_data.length-1][1],nowInfo.SignPriceClose,nowInfo.SignPriceClose,nowInfo.SignPriceClose]);
							if(this.mainEchartType == 1440){
								Window.__dates.push(self.ProcessFunService.timestampCoverHms((nowInfo.Stamp+self.mainEchartType*60)*1000,'ymd'));
							}
							else{
								Window.__dates.push(self.ProcessFunService.timestampCoverHms((nowInfo.Stamp+self.mainEchartType*60)*1000,'all'));
							}
							self.CandelMain.update();
							self.CandelVol.update();
							self.CandelMacd.update();
						}
					}
				}
			}
		});
		/* 初始图表 定位分时图 */
		this.mainEchartType = Window.mainEchartType;
		this.changeChartTime(Window.mainEchartType);
	}
	ngOnDestroy() {
		this.connection.unsubscribe();
	}
	c_lineCross(){
		this.lineCross = !this.lineCross;
		this.LineMain.showCross(this.lineCross);
		this.LineVol.showCross(this.lineCross);
		this.connectEcharts();
	}
	c_cendelCross(){
		this.candelCross = !this.candelCross;
		this.CandelMain.showCross(this.candelCross);
		this.CandelVol.showCross(this.candelCross);
		this.CandelMacd.showCross(this.candelCross);
		this.connectEcharts();
	}
	/* 图表关联 */
	private candelHasConnect:boolean = false;
	connectEcharts(){
		this.candelHasConnect = false;
		if(this.mainEchartType == 0){
			if(Window.line_ma && Window.line_vol){
				echarts.connect([Window.line_ma,Window.line_vol]);
			}
		}
		else{
			if(Window.candel_ma && Window.candel_macd && Window.candel_vol){
				echarts.connect([Window.candel_ma,Window.candel_macd,Window.candel_vol]);
			}
		}
	}
	/* 图表时间切换 */
	changeChartTime(time):void{
		this.mainEchartType = time;
		Window.mainEchartType = time;
		/* 获取历史行情 */
		let self = this;
		if(this.mainEchartType == 0){
			let symbol = Window.nowProId;
			let body = {symbol:symbol,unit:1,startStamp:0,endStamp:0};
			self._http.postJson("trade/price/time/chart/qry",body,function(res){
				Window.__QLastPrice = [];//最近价
				Window.__QChangeRate = [];//涨幅
				Window.__QAveragePrice = [];//均价
				Window.__QOpeningPrice = [];//日开盘价
				Window.__SignQty = [];//分钟成交
				Window.__QPositionQty = [];//总持仓
				Window.__lineDates = [];//分钟时间
				Window.__hasValueData = null;
				Window.__lineDataNum = 0;
				for(let i=0,r=res.list.length;i<r;i++){
					var tmp_data = JSON.parse(res.list[i]);
					Window.__QLastPrice.push(tmp_data.QLastPrice);
					Window.__QChangeRate.push(tmp_data.QChangeRate);
					Window.__QAveragePrice.push(tmp_data.QAveragePrice);
					Window.__SignQty.push(tmp_data.SignQty);
					Window.__QPositionQty.push(tmp_data.QPositionQty);
					Window.__QOpeningPrice = tmp_data.QOpeningPrice;
					if(i == res.list.length-1){
						Window.__hasValueData = Window.__lineDates[Window.__lineDates.length - 1];
						Window.__lineDates.push(self.ProcessFunService.timestampCoverHms((tmp_data.Stamp+60)*1000,'hm'));
					}
					else{
						Window.__lineDates.push(self.ProcessFunService.timestampCoverHms((tmp_data.Stamp)*1000,'hm'));
					}
				}
				Window.__lineDataNum = res.list.length;
				for(var s = Window.__lineDates.length,k=1380;s<k;s++){
					if(s == 1379){
						Window.__lineDates.push('over');
					}
					else{
						Window.__lineDates.push('-');
					}
				}
				self.LineMain.update();
				self.LineVol.update();
			});
		}
		else{
			setTimeout(()=>{
				self.CandelMain.isLoding = true;
				self.CandelVol.isLoding = true;
				self.CandelMacd.isLoding = true;
			},50);
			let symbol = Window.nowProId;
			let body = {symbol:symbol,unit:time,count:500,endStamp:0};
			this._http.postJson("trade/price/candle/chart/qry",body,function(res){
				let data = res.list.reverse();
				Window.CLOSE = [];//收盘价
				Window.__dates = [];//时间
				Window.__volumn = [];//成交量
				Window.__candel_data = [];//开收低高
				Window.__candel_settle_price = [];
				let volumn = [];//成交量
				let candel_data = [];
				let dates = [];
				let settle_price = []
				for(let i=0,r=data.length;i<r;i++){
					var tmp_data = JSON.parse(data[i]);
					Window.CLOSE.push(tmp_data.SignPriceClose);
					volumn.push(tmp_data.SignQty);
					settle_price.push(tmp_data.QPreSettlePrice?tmp_data.QPreSettlePrice:'-');
					candel_data.push([tmp_data.SignPriceOpen,tmp_data.SignPriceClose,tmp_data.SignPriceMin,tmp_data.SignPriceMax]);
					if(time == 1440){
						var newTime = tmp_data.Stamp-isWholePoint;
							dates.push(self.ProcessFunService.timestampCoverHms(tmp_data.Stamp*1000,'ymd'));
					}
					else{
						if(i == data.length-1){
							var isWholePoint = tmp_data.Stamp%(time*60);//判断是否是整点
							if(isWholePoint == 0){
								dates.push(self.ProcessFunService.timestampCoverHms(tmp_data.Stamp*1000,'all'));
							}
							else{
								var newTime = tmp_data.Stamp-isWholePoint+time*60;
								dates.push(self.ProcessFunService.timestampCoverHms(newTime*1000,'all'));
							}
						}
						else{
							dates.push(self.ProcessFunService.timestampCoverHms(tmp_data.Stamp*1000,'all'));
						}
					}
				}
				Window.__dates = dates;
				Window.__volumn = volumn;
				Window.__candel_data = candel_data;
				Window.__candel_settle_price = settle_price;

				self.CandelMain.update();
				self.CandelVol.update();
				self.CandelMacd.update();
			});
		}
	}
	/* 进入行情 */
	viewMarket(){
		this._socket.rejuceProList();
		Window.changeView(0);
	}
	/* 买卖效果 */
	calcuW(_array){
		let max = Math.max.apply( Math, _array );
		let tmp_val = [];
		for(let i=0,r=_array.length;i<r;i++){
			tmp_val.push(_array[i]/max*100);
		}
		return tmp_val;
	};
}
