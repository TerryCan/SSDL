import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';
declare var Window;
@Component({
	selector: 'app-gold',
	templateUrl: './gold.component.html',
	styleUrls: ['./gold.component.css']
})
export class GoldComponent implements OnInit {

	constructor(private _http:HttpService) { }
	errorMsg:string = '';

	bankList:Array<any> = [];
	bankMerchantId;
	hasAccountPWD = false;
	accountPWD = '';
	currencyList = Window.currencyJson;
	currency = Window.currencyJson[0].currency;
	outputInfo;
	extract = '--';
	outGold:number = 0;
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
	}
	checkedPWD(){
		let self = this;
		this._http.postJson("account/query/user/aiaccountm/bypassword",{"accountPassword":this.accountPWD,"currency":this.currency},function(res){
			if(res.code == '000000'){
				self.hasAccountPWD = true;
				self.outputInfo = JSON.parse(res.content);
				self.extract = self.outputInfo.extract;
			}
		});
	}
	changeCurrent(){
		this.checkedPWD();
	}
	gold(){
		let self = this;
		if(this.outGold < 1){
			this.errorMsg = '出金金额非法';
		}
		else{
			this._http.postJson("account/money/out/app",{"accountPassword":this.accountPWD,"payAmount":this.outGold,"toBankMerchantId":this.bankMerchantId},function(res){
				if(res.code == '000000'){
					self.errorMsg = '';
					self.clearHeaderNav();
					Window._alert("出金成功,请等待审核");
				}
			});
		}
	}
}
