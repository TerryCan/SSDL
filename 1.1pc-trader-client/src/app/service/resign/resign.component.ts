import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';
declare var Window;

@Component({
	selector: 'app-resign',
	templateUrl: './resign.component.html',
	styleUrls: ['./resign.component.css']
})
export class ResignComponent implements OnInit {

	constructor(private _http:HttpService) { }

	provinceList:Array<any> = [];
	provinceVal = '';

	cityList:Array<any> = [];
	cityVal;

	bankList:Array<any> = [];
	bankVal;

	subBankLsit:Array<any> = [];
	subBankVal = '';

	/* 错误信息验证提示 */
	errorMsg:string = '';

	clearHeaderNav(){
		Window.clearCurrentNav();
	}
	ngOnInit() {
		/* 获取省份列表 */
		let self = this;
		this._http.postJson('mss/query/all/province',{},function(res){
			self.provinceList = JSON.parse(res.content);
			self.provinceVal = self.provinceList[0].id;
			self.getCity(self.provinceVal);
		});
		this.getBank();
		this.basicGetSubBankList();
		/* 获取签约信息 */
		console.log(Window.signInfo)
		this.bankCar = Window.signInfo.cardNo;
		this.name = Window.signInfo.cardName;
		this.certificateCode = Window.signInfo.identityCard;
		this.phone = Window.signInfo.cusMobile;

	}
	/* 初始获取银行支行 */
	basicGetSubBankList(){
		let self = this;
		if(this.cityVal && this.bankVal){
			this.getSubBankList();
		}
		else{
			setTimeout(()=>{
				self.basicGetSubBankList();
			},1000);
		}
	}
	/* 获取城市 */
	getCity(id){
		let self = this;
		this._http.postForm('mss/query/city/by/provinceId',{search_EQ_fatherCityId:id},function(res){
			self.cityList = JSON.parse(res.content);
			self.cityVal = -1;
		});
	}
	/* 获取所属银行 */
	getBank(){
		let self = this;
		this._http.postForm('bank/area/mainbank',{},function(res){
			self.bankList = JSON.parse(res.content);
			self.bankVal = -1;
		});
	}
	/* 获取支行列表 */
	getSubBankList(){
		let self = this;
		this._http.postForm('bank/area/bankname',{search_LLIKE_id:self.bankVal+''+self.cityVal},function(res){
			self.subBankLsit = JSON.parse(res.content);
		});
	}
	/* 签约 */
	bankCar:string = '';
	name:string = '';
	certificateCode:string = '';
	phone:string = '';
	goldPWD:string = '';
	repeatGoldPWD:string = '';
	resign(){
		if(this.bankCar == ''){
			this.errorMsg = '银行卡号不能为空';
		}
		else if(this.name == ''){
			this.errorMsg = '开户姓名不能为空';
		}
		else if(this.certificateCode == ''){
			this.errorMsg = '身份证号不能为空';
		}
		else if(this.phone == ''){
			this.errorMsg = '手机号不能为空';
		}
		else if(this.goldPWD == ''){
			this.errorMsg = '资金密码不能为空';
		}
		else if(this.goldPWD.length < 6){
			this.errorMsg = '资金密码错误';
		}
		else{
			let custBank,recvBankNm;
			for(let i=0,r=this.bankList.length;i<r;i++){
				if(this.bankList[i].bankCode == this.bankVal){
					custBank = this.bankList[i].id;
					break;
				}
			}
			for(let i=0,r=this.subBankLsit.length;i<r;i++){
				if(this.subBankLsit[i].id == this.subBankVal){
					recvBankNm = this.bankList[i].bankName;
					break;
				}
			}
			let body = {
				"updateSignV":
				{
					"accountId":Window.userInfo.userId,
					"cardNo":this.bankCar,
					"cardName":this.name,
					"identityCard":this.certificateCode,
					"mobile":this.phone,
					"custBank":custBank,
					"recvTgfi":this.subBankVal,
					"recvBankNm":recvBankNm,
					"accountPassword":this.goldPWD
				}
			};
			let self = this;
			this._http.postJson("exbank/update/sign/account",body,function(res){
				if(res.code == '000000'){
					self.refreshSignInfo();
					self.clearHeaderNav();
					self.errorMsg = '';
					Window._alert('换绑成功');
				}
			});
		}
	}
	/* 刷新签约信息 */
	refreshSignInfo(){
		this._http.postJson('exbank/get/user/signup',{},function(res){
			if(res.code == '000000'){
				Window.signInfo = JSON.parse(res.content);
			}
		});
	}
}
