import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';
declare var Window;
@Component({
	selector: 'app-sign',
	templateUrl: './sign.component.html',
	styleUrls: ['./sign.component.css']
})
export class SignComponent implements OnInit {

	constructor(private _http:HttpService) { }
	public showSign:boolean = false;

	private provinceList:Array<any> = [];
	private provinceVal = '';

	private cityList:Array<any> = [];
	private cityVal = '';

	private bankList:Array<any> = [];
	private bankVal = '';

	private subBankLsit:Array<any> = [];
	private subBankVal = '';

	/* 错误信息验证提示 */
	private errorMsg:string = '';

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
			self.cityVal = self.cityList[0].bankAreaCode;
		});
	}
	/* 获取所属银行 */
	getBank(){
		let self = this;
		this._http.postForm('bank/area/mainbank',{},function(res){
			self.bankList = JSON.parse(res.content);
			self.bankVal = self.bankList[0].bankCode;
		});
	}
	/* 获取支行列表 */
	getSubBankList(){
		let self = this;
		this._http.postForm('bank/area/bankname',{search_LLIKE_id:self.bankVal+''+self.cityVal},function(res){
			self.subBankLsit = JSON.parse(res.content);
			self.subBankVal = self.subBankLsit[0].id;
		});
	}
	/* 签约 */
	private bankCar:string = '';
	private name:string = '';
	private certificateCode:string = '';
	private phone:string = '';
	private goldPWD:string = '';
	private repeatGoldPWD:string = '';
	sign(){
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
			this.errorMsg = '资金密码不能小于6位';
		}
		else if(this.goldPWD !== this.repeatGoldPWD){
			this.errorMsg = '2次密码输入不一致';
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
				"signUpV":
				{
					"userId":Window.userInfo.userId,
					"custName":Window.userInfo.loginName,
					"cardNo":this.bankCar,
					"cardName":this.name,
					"identityCard":this.certificateCode,
					"mobile":this.phone,
					"custBank":custBank,
					"recvTgfi":this.subBankVal,
					"recvBankNm":recvBankNm,
					"accountPassword":this.goldPWD,
					"repeatAccountPassword":this.repeatGoldPWD
				}
			};
			let self = this;
			this._http.postJson("exbank/sign/up",body,function(res){
				if(res.code == '000000'){
					self.refreshSignInfo();
					self.showSign = false;
					Window.isSign(true);
					Window._alert('签约成功');
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
