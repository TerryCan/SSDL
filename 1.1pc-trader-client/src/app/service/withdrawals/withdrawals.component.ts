import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';
declare var Window;

@Component({
	selector: 'app-withdrawals',
	templateUrl: './withdrawals.component.html',
	styleUrls: ['./withdrawals.component.css']
})
export class WithdrawalsComponent implements OnInit {
	constructor(private _http:HttpService) { }
	errorMsg:string = '';

	bankList:Array<any> = [];
	bankMerchantId;
	hasAccountPWD = false;
	accountPWD = '';
	outputInfo;
	balance = '--';
	outGold:number = 0;

	bankCar:string = '';
	name:string = '';
	certificateCode:string = '';
	phone:string = '';
	accountId:string = '';
	comment:string = '';

	clearHeaderNav(){
		Window.clearCurrentNav();
	}
	ngOnInit() {
		
		/* 获取银行通道 */
		let self = this;
		this._http.postJson("exbank/get/user/signup/list",{},function(res){
			self.bankList = JSON.parse(res.content);
			self.bankMerchantId = self.bankList[0].bankMerchantId;
		});
		this.hasAccountPWD = false;
		this.accountPWD = '';
		/* 获取签约信息 */
		this.bankCar = Window.signInfo.cardNo;
		this.name = Window.signInfo.cardName;
		this.certificateCode = Window.signInfo.identityCard;
		this.phone = Window.signInfo.cusMobile;
	}
	checkedPWD(){
		let self = this;
		this._http.postJson("exbank/get/user/signup/password",{"accountPassword":this.accountPWD,"bankMerchantId":this.bankMerchantId,"userId":Window.userInfo.userId},function(res){
			if(res.code == '000000'){
				self.hasAccountPWD = true;
				self.outputInfo = JSON.parse(res.content);
				self.balance = self.outputInfo.balance;
				self.accountId = self.outputInfo.accountSignupId;
			}
		});
	}
	withdrawals(){
		let self = this;
		if(this.outGold < 1){
			this.errorMsg = '提现金额非法';
		}
		else{
			this._http.postJson("exbank/confirm/pay",{"accountPassword":this.accountPWD,"ioNumber":this.outGold,"bankMerchantId":this.bankMerchantId,"accountId":this.accountId,"comment":this.comment},function(res){
				if(res.code == '000000'){
					self.clearHeaderNav();
					self.errorMsg = '';
					Window._alert("提现成功,请等待审核");
				}
				else{
					self.errorMsg = res.message;
				}
			},false);
		}
	}
}
