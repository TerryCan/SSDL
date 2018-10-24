import { Component, OnInit } from '@angular/core';
import { MarketSourceComponent } from '../market-source/market-source.component';
import { EchartsDrawComponent } from '../echarts-draw/echarts-draw.component';
import { SocketIoService } from '../socket.io.service';
declare var baseConfig,Window;
@Component({
	selector: 'app-main-market',
	templateUrl: './main-market.component.html',
	styleUrls: ['./main-market.component.css']
})
export class MainMarketComponent implements OnInit {

	constructor(private _socket:SocketIoService) {
		Window.nowTraderShow = 0;
		/* 产品图表 更改 */
		Window.changeProEchartsShow = ()=>{
			this.showColumn = -1;
			setTimeout(()=>{
				this.showColumn = 1;
			},100);
		}
		Window.changeView = (num) => {
			this.showColumn = num;
			Window.nowTraderShow = num;
		}
	}

	showColumn:number = 0;//0:行情 1:图表

	ngOnInit() {

	}
}
