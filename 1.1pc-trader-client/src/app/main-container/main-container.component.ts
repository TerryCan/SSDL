import { Component, OnInit, OnDestroy } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { Router,ActivatedRoute } from "@angular/router";
import { HttpService } from '../http.service';
import { SocketIoService } from '../socket.io.service';
declare var baseConfig,Window,nwOption;
@Component({
	selector: 'app-main-container',
	templateUrl: './main-container.component.html',
	styleUrls: ['./main-container.component.css']
})
export class MainContainerComponent implements OnInit,OnDestroy {

	constructor(private router: Router,private routeInfo:ActivatedRoute,private _http:HttpService, private _socket:SocketIoService) {
		
	}
	private pingT;
	ngOnInit() {
		//nwOption.mainContainerPage();
		/* 进入主页 加载socket */
		this.router.navigate(['mainMarket'],{relativeTo:this.routeInfo});
		Window.changeRouter = (name)=>{
			this.router.navigate([name],{relativeTo:this.routeInfo});
		}
		/* 心跳连接 */
		let self = this;
		this.pingT = setInterval(()=>{
			self._http.postJson('user/ping',{},function(){
				//
			})
		},120000);
	}
	ngOnDestroy() {
		clearInterval(this.pingT);
	}
	/* 市场更改 */
	currentMarket:string = 'mainMarket';
	changeMarket(name):void {
		switch (name) {
			case "mainMarket":
				this.router.navigate(['mainMarket'],{relativeTo:this.routeInfo});
				break;
		}
	}
	/* 交易页面 */
	showTrader:boolean = false;
	trader(showTrader:boolean){
		this.showTrader = showTrader;
	}
}
