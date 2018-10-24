import { Component, OnInit, OnDestroy, EventEmitter, ElementRef } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { SocketIoService } from '../socket.io.service';
import * as $ from "jquery";

declare var baseConfig,Window;
@Component({
  selector: 'app-market-source',
  templateUrl: './market-source.component.html',
  styleUrls: ['./market-source.component.css']
})
export class MarketSourceComponent implements OnInit,OnDestroy {
	productList;
	c_i;//选中的产品编号
	connection;
	constructor(private _socket:SocketIoService,private changeDetectorRef:ChangeDetectorRef,private el:ElementRef) {
		
	}
	ngOnInit() {
		/* 切换指标 */
		Window.changeMarketContract = (id)=>{
			Window.nowProId = id;
			if(id == -1){
				this.c_i = -1;
			}
			else{
				for(let i=0,r=Window.marketList.length;i<r;i++){
					if(Window.marketList[i].productId == id){
						this.c_i = i;
						break;
					}
				}	
			}
			setTimeout(function(){
				if($(".dataMoveCon li.active").length > 0){
					$(".dataMoveCon").animate({scrollTop: $(".dataMoveCon li.active").position().top},100);
				}
			},50);
		}
		this.dataMoveEffect();
		this.readMarketList();
		window.onresize = ()=>{
			this.dataMoveEffect();
		}
		if(Window.nowProId){
			Window.changeMarketContract(Window.nowProId);
		}
	}
	ngOnDestroy() {
		this.connection.unsubscribe();
	}
	/* 行情列表 移动显示字段 */
	private showSpanNum:number;
	private allMoveCon:number;
	private startNum:number;
	private endNum:number;
	dataMoveEffect(){
		var marketSource = $('#market-source').width();
		var moveContent = marketSource - 394 - 80;
		this.showSpanNum = Math.floor(moveContent/100);
		this.startNum = 0;
		this.endNum = this.showSpanNum;
		this.allMoveCon = 13;
		let self = this;
		if(self.showSpanNum >= 13){
			$('#title-move').hide();
		}
		else{
			$('#title-move').show();
		}
		$('.dataMoveCon li').each(function(){
			$(this).find(".moveContent").hide();
			$(this).find(".moveContent:lt("+(self.showSpanNum)+")").show();
		});
		$(".title.dataMoveCon .moveContent").hide();
		$(".title.dataMoveCon .moveContent:lt("+(self.showSpanNum)+")").show();
	}
	/* 数据左移动 */
	dataMoveLeft(){
		let self = this;
		if(this.startNum > 0){
			self.startNum--;
			self.endNum--;
			$(".title.dataMoveCon .moveContent").eq(self.endNum).hide();
			$(".title.dataMoveCon .moveContent").eq(self.startNum).show();
			$('.dataMoveCon li').each(function(){
				$(this).find(".moveContent").eq(self.endNum).hide();
				$(this).find(".moveContent").eq(self.startNum).show();
			});
		}
	}
	/* 数据右移动 */
	dataMoveRight(){
		let self = this;
		if(this.endNum < this.allMoveCon+1){
			$(".title.dataMoveCon .moveContent").eq(self.endNum).show();
			$(".title.dataMoveCon .moveContent").eq(self.startNum).hide();
			$('.dataMoveCon li').each(function(){
				$(this).find(".moveContent").eq(self.endNum).show();
				$(this).find(".moveContent").eq(self.startNum).hide();
			});
			self.startNum++;
			self.endNum++;
		}
	}
	/* 初始读取行情列表 */
	readMarketList(){
		if(Window.productIdList && Window.productIdList.length > 0){
			Window.productIdListScroll = Window.productIdList.slice(0,25);
			this._socket.addProList();
			this.getBaseData();
		}
		else{
			setTimeout(()=>{
				this.readMarketList();
			},200);
		}
	}
	/* 滚动添加行情 */
	scrollTime;
	dataScroll(){
		clearTimeout(this.scrollTime);
		let element = this.el.nativeElement.querySelector('#proList');
		let nowScroll = element.scrollTop;
		this.scrollTime = setTimeout(()=>{
			this._socket.rejuceProList();
			let start = Math.floor(nowScroll/40);
			let end = start+25;
			Window.productIdListScroll = Window.productIdList.slice(start,end);
			this._socket.addProList();
		},300);
	}
	/* 获取基础行情 */
	getBaseData(){
		this.productList = Window.marketList;
		this.connection = this._socket.getPrice().subscribe(data => {
			let marketPrice = JSON.parse(data.toString());
			for(let i=0,r=Window.marketList.length;i<r;i++){
				if(Window.marketList[i].productId == marketPrice.ProductId){
					/* 价格变更效果 */
					if(Window.marketList[i].QLastPrice !== marketPrice.QLastPrice){
						Window.marketList[i].isChangeLastPrice = (Window.marketList[i].isChangeLastPrice == 1)?2:1;
					}
					if(Window.marketList[i].QAskPrice !== marketPrice.QAskPrice[0]){
						Window.marketList[i].isChangeAskPrice = (Window.marketList[i].isChangeAskPrice == 1)?2:1;
					}
					if(Window.marketList[i].QBidPrice !== marketPrice.QBidPrice[0]){
						Window.marketList[i].isBidPrice = (Window.marketList[i].isBidPrice == 1)?2:1;
					}

					Window.marketList[i].QLastPrice = marketPrice.QLastPrice;
					Window.marketList[i].QAskPrice = marketPrice.QAskPrice[0];
					Window.marketList[i].QAskQty = marketPrice.QAskQty;
					Window.marketList[i].QBidPrice = marketPrice.QBidPrice[0];
					Window.marketList[i].QBidQty = marketPrice.QBidQty;
					Window.marketList[i].QTotalQty = marketPrice.QTotalQty;
					Window.marketList[i].QPositionQty = marketPrice.QPositionQty;
					Window.marketList[i].QPreClosingPrice = marketPrice.QPreClosingPrice;
					Window.marketList[i].QChangeValue = marketPrice.QChangeValue;
					Window.marketList[i].QChangeRate = marketPrice.QChangeRate;
					Window.marketList[i].QOpeningPrice = marketPrice.QOpeningPrice;
					Window.marketList[i].QHighPrice = marketPrice.QHighPrice;
					Window.marketList[i].QLowPrice = marketPrice.QLowPrice;
					Window.marketList[i].Stamp = marketPrice.Stamp*1000;
					Window.marketList[i].QSwing = marketPrice.QSwing;
					break;
				}
			}
			this.productList = Window.marketList;
		});
	}
	/* 选中产品 */
	choosePro(index,id) {
		Window.nowProId = id;
		if(this.c_i == index){
			this.c_i = -1;
			if(Window.changeTraderContract)
			Window.changeTraderContract('');
		}
		else{
			this.c_i = index;
			if(Window.changeTraderContract)
			Window.changeTraderContract(id);
		}
	}
	/* 进入图表 */
	viewProDetail(id){
		Window.nowProId = id;
		this._socket.rejuceProList();
		Window.changeView(1);
		setTimeout(()=>{
			this._socket.addSingleProList(Window.nowProId);
		},500);
	}
}
