import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';
declare var Window;

@Component({
	selector: 'app-into-gold',
	templateUrl: './into-gold.component.html',
	styleUrls: ['./into-gold.component.css']
})
export class IntoGoldComponent implements OnInit {

	constructor(private _http:HttpService) { }

	errorMsg:string = '';

	bankList:Array<any> = [];
	bankMerchantId;
	hasAccountPWD = false;
	accountPWD = '';
	outputInfo;
	balance = '--';
	outGold:number = 0;
	ngOnInit() {
		/* 获取银行通道 */
		let self = this;
		this._http.postJson("exbank/get/user/signup/list",{},function(res){
			self.bankList = JSON.parse(res.content);
			self.bankMerchantId = self.bankList[0].bankMerchantId;
		});
		this.hasAccountPWD = false;
		this.accountPWD = '';
	}
	clearHeaderNav(){
		Window.clearCurrentNav();
	}
	checkedPWD(){
		let self = this;
		this._http.postJson("exbank/get/user/signup/password",{"accountPassword":this.accountPWD,"bankMerchantId":this.bankMerchantId,"userId":Window.userInfo.userId},function(res){
			if(res.code == '000000'){
				self.hasAccountPWD = true;
				self.outputInfo = JSON.parse(res.content);
				self.balance = self.outputInfo.balance;
			}
		});
	}
	changeBank(){
		this.checkedPWD();
	}
	gold(){
		let self = this;
		if(this.outGold < 1){
			this.errorMsg = '入金金额非法';
		}
		else{
			let bankSignupId;
			for(let i=0,r=this.bankList.length;i<r;i++){
				if(this.bankList[i].bankMerchantId == this.bankMerchantId){
					bankSignupId = this.bankList[i].bankSignupId;
					break;
				}
			}
			this._http.postJson("exbank/money/in/app",{"accountPassword":this.accountPWD,"payAmt":this.outGold,"bankSignupId":bankSignupId,"userId":Window.userInfo.userId},function(res){
				if(res.code == '000000'){
					self.errorMsg = '';
					self.clearHeaderNav();
					Window._alert("入金成功,请等待审核");
				}
			});
		}
	}

}
