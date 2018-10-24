import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';
declare var Window,window;

@Component({
	selector: 'app-recharge',
	templateUrl: './recharge.component.html',
	styleUrls: ['./recharge.component.css']
})
export class RechargeComponent implements OnInit {

	constructor(private _http:HttpService) { }
	errorMsg:string = '';

	payList:Array<any> = [];
	bankMerchantId;

	bankList:Array<any> = [];
	bankId;
	payAmt;

	clearHeaderNav(){
		Window.clearCurrentNav();
	}
	ngOnInit() {
		/* 获取充值通道 */
		let self = this;
		this._http.postJson("exbank/get/user/signup/list",{},function(res){
			self.payList = JSON.parse(res.content);
			self.bankMerchantId = self.payList[0].bankMerchantId;
		});
		this.getBank();
	}
	/* 获取所属银行 */
	getBank(){
		let self = this;
		this._http.postForm('bank/area/mainbank',{},function(res){
			self.bankList = JSON.parse(res.content);
			self.bankId = self.bankList[0].id;
		});
	}
	recharge(){
		let self = this;
		if(this.payAmt > 0 && this.payAmt != ''){
			this._http.postJson('exbank/create/online/payid',{"userId":Window.userInfo.userId,"bankMerchantId":this.bankMerchantId,"bankCode":this.bankId,"payAmt":this.payAmt},function(res){
				if(res.code == '000000'){
					self.clearHeaderNav();
					self.errorMsg = '';
					let payid = res.content;
					self._http.postForm("thirdpay/baofoo/gatepay/online/pay",{payId : payid},function(res){
						self.errorMsg = '';
						var data = JSON.parse(res.content);
						var html = window.escape(data.urlStr);
						var newUrl = localStorage.getItem('_http').replace('riskcontrol/','');
						let baseConfig = JSON.parse(localStorage.getItem('baseConfig'));
						window.open(newUrl+baseConfig.recharge+"?data="+html,'','width=900,height=600,left=100,top=100');
					});
				}
				else{
					self.errorMsg = res.message;
				}
			},false);
		}
		else{
			this.errorMsg = '充值金额非法';
		}
	}
}
