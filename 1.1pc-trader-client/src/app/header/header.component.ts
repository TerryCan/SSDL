import { Component,ElementRef,ViewChild, OnInit,EventEmitter, Output } from '@angular/core';
import { SocketIoService } from '../socket.io.service';
import { HttpService } from '../http.service';

import { IndexsManageComponent } from '../indexs-manage/indexs-manage.component';
import { SignComponent } from '../service/sign/sign.component';
import { ResignComponent } from '../service/resign/resign.component';
import { GoldComponent } from '../service/gold/gold.component';
import { IntoGoldComponent } from '../service/into-gold/into-gold.component';
import { WithdrawalsComponent } from '../service/withdrawals/withdrawals.component';
import { RechargeComponent } from '../service/recharge/recharge.component';
import { UserInformationComponent } from '../user-information/user-information.component';

declare var Window;
@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
	@Output() trader: EventEmitter<any> = new EventEmitter();

	@ViewChild(IndexsManageComponent)
	private IndexsManage:IndexsManageComponent;
	@ViewChild(SignComponent)
	private Sign:SignComponent;
	@ViewChild(ResignComponent)
	private reSign:ResignComponent;
	@ViewChild(GoldComponent)
	private gold:GoldComponent;
	@ViewChild(IntoGoldComponent)
	private intoGold:IntoGoldComponent;
	@ViewChild(WithdrawalsComponent)
	private withdrawals:WithdrawalsComponent;
	@ViewChild(RechargeComponent)
	private recharge:RechargeComponent;
	@ViewChild(UserInformationComponent)
	private userInformation:UserInformationComponent;

	isSign:boolean = false;
	constructor(private el:ElementRef,private _socket:SocketIoService,private _http:HttpService) {
		/* 更改服务模块 菜单 */
		let self = this;
		Window.isSign = (boolean)=>{
			self.isSign = boolean;
		}
		this.getIsSign();
		Window.showTrader = ()=>{
			this.columnRouter('trademark');
		}
		document.onkeydown = (e)=>{
			console.log(e.which)
			let keyNum = e.which;
			if(keyNum == 113){
				Window.showTrader()
			}
		}
		/* 清空当前菜单 */
		Window.clearCurrentNav = ()=>{
			this.currentNav = '';
		}
	}

	navList = JSON.parse(localStorage.getItem('baseConfig')).nav;

	ngOnInit() {
		this.getCurrency();
	}
	/* 主菜单切换 */
	showTrader:boolean = false;
	public currentNav:string = '';
	columnRouter(params):void {
		console.log(params);
		this.currentNav = params;
		setTimeout(()=>{
			switch (params) {
				case "indexsManage":
					this.IndexsManage.isShowIndexsManage = true;
					break;
				case "trademark":
					this.showTrader = !this.showTrader;
					Window.ShowBS = this.showTrader;
					if(Window.changeShowBS){
						Window.changeShowBS(Window.ShowBS);
					}
					if(this.showTrader){
						this._socket.addPersonalGold();
					}
					else{
						this._socket.rejucePersonalGold();
					}
					this.trader.emit(this.showTrader);
					if(Window.allChartsResize){
						Window.allChartsResize();
					}
					break;
				case "currentNews":
					Window.changeRouter('realTimeNews');
					break;
				case "economicCalendar":
					Window.changeRouter('financialCalendar');
					break;
				case "topic":
					Window.changeRouter('topic');
					break;
				case "sign":
					this.Sign.showSign = true;
					break;
				case "userInfo":
					this.userInformation.showUserInformation = true;
					break;
				case "webSite":
					let baseConfig = JSON.parse(localStorage.getItem('baseConfig'))
					window.open(baseConfig.webSite,'','width=900,height=600,left=100,top=100');
			}
		},100);
	}
	/* 获取币种 */
	getCurrency(){
		this._http.postJson('config/exchange/currency/valid/as/list/query',{},function(data){
			localStorage.setItem('currency',JSON.stringify(JSON.parse(data.content)));
		})
	}
	/* 获取是否签约 -> 控制菜单初始化显示 */
	getIsSign(){
		let self = this;
		this._http.postJson('exbank/get/user/signup',{},function(res){
			if(res.code == '000000'){
				self.isSign = (res.content == '')?false:true;
				if(res.content != ''){
					Window.signInfo = JSON.parse(res.content);
				}
			}
		});
	}
}
