import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketIoService } from '../socket.io.service';
declare var Window;
@Component({
	selector: 'app-trade-mark',
	templateUrl: './trade-mark.component.html',
	styleUrls: ['./trade-mark.component.css']
})
export class TradeMarkComponent implements OnInit {
	account:any = {};
	private currencyList = JSON.parse(localStorage.getItem('currency'));

	/* 交易菜单 */
	traderList;
	/* 菜单交互变量 */
	cTrader:string;
	/* 持仓合计/明细 切换 */
	positionTotalDetailShow:number = 1;

	private connect1;
	private connect2;

	constructor(private _socket:SocketIoService) {
		const data = JSON.parse(localStorage.getItem('baseConfig'));
		this.traderList = data.trader_nav;
		this.cTrader = data.trader_nav[0].name;
	}

	ngOnInit() {
		this.connect1 = this._socket.getAccount().subscribe(data => {
			this.account = JSON.parse(data.toString());
		});
		this.connect2 = this._socket.getOrderBack().subscribe(data => {
			let tips = JSON.parse(data.toString());
			let info;
			if(tips.content.errorMsgExt){
				Window._alert(Window.orderState[tips.content.orderState].name+': '+tips.content.errorMsgExt);
			}
			else{
				Window._alert(Window.orderState[tips.content.orderState].name);
			}
		});
	}
	ngOnDestroy() {
		this.connect1.unsubscribe();
		this.connect2.unsubscribe();
	}
	/* 菜单变更 */
	changeNav(name){
		this.cTrader = name;
	}
	currencyText(num){
		for(let i=0,r=this.currencyList.length;i<r;i++){
			if(this.account.currency == this.currencyList[i].currency){
				return this.currencyList[i].currencyCode;
			}
		}
	}
}
