import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';
import { SocketIoService } from '../socket.io.service';
declare var baseConfig,Window,io,nwOption;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [HttpService]
})
export class LoginComponent implements OnInit {
	constructor(private _http:HttpService,private router: Router,private _socket:SocketIoService,private sanitizer: DomSanitizer) {
		
	}
	configData = baseConfig;
	nowConfigData;
	sysVersion:string = "2.3.8.19";
	frameUrl:any = '';
	/* 登录变量 */
	loginErrorMsg:string = '';
	chooseLine;
	orgcode:string = '';
	username:string = '';
	password:string = '';
	public loginLoading:boolean = false;
	/* 记住密码 */
	savePWD:boolean = false;

	/* 是否阅读风险提示 */
	hasReadRisktip:boolean = true;
	ngOnInit() {
		//nwOption.loginPage();
		if(Window.restartApp){
			location.reload();
		}
		localStorage.setItem('userInfo',"{}");
		this.nowConfigData = this.configData[0];
		this.chooseLine = this.configData[0].id;
		localStorage.setItem('baseConfig',JSON.stringify(this.configData[0]));
		if(localStorage.getItem('userLoginInfo') != null){
			this.savePWD = true;
			let userLoginInfo = JSON.parse(localStorage.getItem('userLoginInfo'));
			this.orgcode = userLoginInfo.j_orgcode;
			this.username = userLoginInfo.j_username;
			this.password = userLoginInfo.j_password;
		}
		else{
			this.orgcode = '';
			this.username = '';
			this.password = '';
			this.savePWD = false;
		}
		if(Window.socket){
			Window.socket.close();
		}
	}
	showClosePositionMsg:boolean = false;
	ClosePositionMsg(){
		this.showClosePositionMsg = true;
		let baseConfig = JSON.parse(localStorage.getItem("baseConfig"));
		this.frameUrl = this.sanitizer.bypassSecurityTrustResourceUrl("/assets/localData/"+baseConfig.id+"/"+baseConfig.closePositionMessage);
	}
	logIn() {
		if(this.hasReadRisktip != true){
			Window._alert("请先阅读风险提示");
			return;
		}
		if (this.orgcode == '') {
			Window._alert('请输入机构码');
		}
		else if (this.username == '') {
			Window._alert('请输入用户名');
		}
		else if (this.password == '') {
			Window._alert('请输入密码');
		}
		else {
			let self = this;
			let body = {
				j_orgcode : this.orgcode,
				j_username : this.username,
				j_password : this.password
			}
			let nowConfigData  = JSON.parse(localStorage.getItem('baseConfig'));
			localStorage.setItem('_http',nowConfigData.http);
			localStorage.setItem('_socket',nowConfigData.websocket);
			Window.isConnect = false;
			this.loginLoading = true;
			this._http.postForm('login_check',body,function(data){
				if(data.code == '000000'){
					if(data.user.userState == 1){
						if(self.savePWD == true){
							localStorage.setItem('userLoginInfo',JSON.stringify(body));
						}
						Window.userInfo = data.user;
						Window.openReconnect = true;
						self._socket.creatNewSocket(function(){
							/* 获取产品币种 */
							let currencyJson;
							self._http.postForm('config/exchange/currency/valid/as/list/query',{},function(data){
								currencyJson = JSON.parse(data.content);
								Window.currencyJson = currencyJson;
								/* 获取合约列表 */
								self._http.postForm('config/product/may/order/query/with/orgcode/as/list',{},function(data){
									Window.productList = JSON.parse(data.content);
									Window.productIdList = [];
									Window.marketList = []
									for(let i=0,r=Window.productList.length;i<r;i++){
										Window.productIdList.push(Window.productList[i].productId);
										let tmp_currencyCode = '';
										for(let x=0,y=currencyJson.length;x<y;x++){
											if(currencyJson[x].currency == Window.productList[i].productCurrency){
												tmp_currencyCode = currencyJson[x].currencyCode;
												break;
											}
										}
										let tmpArr = {
											"productId":Window.productList[i].productId,
											"productName":Window.productList[i].productName,
											"QLastPrice":'-',
											"isChangeLastPrice":1,
											"QAskPrice":'-',
											"isChangeAskPrice":1,
											"QAskQty":'-',
											"QBidPrice":'-',
											"isBidPrice":1,
											"QBidQty":'-',
											"QTotalQty":"-",
											"QPositionQty":"-",
											"QPreClosingPrice":"-",//昨收
											"QChangeValue":"-",//涨跌
											"QChangeRate":"-",//涨幅
											"QOpeningPrice":"-",//开盘
											"QHighPrice":"-",//最高
											"QLowPrice":"-",//最低
											"Stamp":"",//时间
											"productCode":Window.productList[i].productCode,
											"productCurrency":Window.productList[i].productCurrency,
											"currencyCode":tmp_currencyCode,
											"unionMinPrices":Window.productList[i].unionMinPrices,
											"QSwing":"-"//振幅
										};
										Window.marketList.push(tmpArr);
									}
									let isConnectTime = setInterval(()=>{
										console.log('login loading')
										if(Window.isConnect){
											clearInterval(isConnectTime);
											self.loginLoading = false;
											self.router.navigate(['/mainContainer']);
										}
									},200);
								});
							});
						});
					}
					else if(data.user.userState == -3){
						Window._confirm([{"name":"提示","value":"该账户开户被驳回，请修改开户资料"}],function(){
							localStorage.setItem('userInfo',JSON.stringify(data));
							self.loginLoading = false;
							self.router.navigate(['/register']);
						});
					}
					else if(data.user.userState == -2){
						Window._alert('用户待审核中');
						self.loginLoading = false;
					}
				}
				else{
					Window._alert(JSON.parse((<any>data)._body).message);
					self.loginLoading = false;
				}
			},false);
			setTimeout(()=>{
				self.loginLoading = false;
			},5000);
		}
		return false;
	}
	isSavePWD(){
		if(this.savePWD == false){
			localStorage.removeItem('userLoginInfo');
		}
	}
	changeLine(){
		for(let i=0,r=this.configData.length;i<r;i++){
			if(this.configData[i].id == this.chooseLine){
				this.nowConfigData = this.configData[i];
				localStorage.setItem('baseConfig',JSON.stringify(this.nowConfigData));
				let nowConfigData  = JSON.parse(localStorage.getItem('baseConfig'));
				localStorage.setItem('_http',nowConfigData.http);
				localStorage.setItem('_socket',nowConfigData.websocket);
			}
		}
	}
	clearUserInfo(){
		localStorage.setItem('userInfo',"{}");
	}
}
