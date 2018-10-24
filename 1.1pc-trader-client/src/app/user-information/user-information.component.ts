import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../http.service';
declare var Window,nwOption;

@Component({
	selector: 'app-user-information',
	templateUrl: './user-information.component.html',
	styleUrls: ['./user-information.component.css']
})
export class UserInformationComponent implements OnInit {

	constructor(private _http:HttpService,private router: Router) { }
	public showUserInformation:boolean = false;
	userInfo = Window.userInfo;
	PWDtype:number = -1;

	/* 个人密码变量 */
	personalOldPwd:string = '';
	personalNewPwd:string = '';
	personalRepeatPwd:string = '';

	/* 资金密码变量 */
	goldOldPwd:string = '';
	goldNewPwd:string = '';
	goldRepeatPwd:string = '';

	personalErrorMsg:string = '';
	goldErrorMsg:string = '';

	ngOnInit() {
		//
	}
	/* 修改个人密码 */
	changePersonalPwd(){
		if(this.personalOldPwd == ''){
			this.personalErrorMsg = '旧密码不能为空';
		}
		else if(this.personalOldPwd.length < 6){
			this.personalErrorMsg = '旧密码错误';
		}
		else if(this.personalNewPwd == ''){
			this.personalErrorMsg = '新密码不能为空';
		}
		else if(this.personalNewPwd.length < 6){
			this.personalErrorMsg = '新密码不能小于6位';
		}
		else if(this.personalNewPwd !== this.personalRepeatPwd){
			this.personalErrorMsg = '2次密码输入不一致';
		}
		else{
			this.personalErrorMsg = '';
			let self = this;
			let body = {"type":1,"value":this.personalNewPwd,"password":this.personalOldPwd};
			this._http.postJson("user/edit/key/info/oneself",body,function(res){
				if(res.code == '000000'){
					self.showUserInformation = false;
					Window._confirm([{"name":"提示","value":"修改成功,请重新登录"}],function(){
						self.router.navigate(['/login']);
						nwOption.loginPage();
					});
				}
				else{
					self.personalErrorMsg = res.message;
				}
			},false);
		}
	}
	/* 修改资金密码 */
	changeGoldPwd(){
		if(this.goldOldPwd == ''){
			this.goldErrorMsg = '旧密码不能为空';
		}
		else if(this.goldOldPwd.length < 6){
			this.goldErrorMsg = '旧密码错误';
		}
		else if(this.goldNewPwd == ''){
			this.goldErrorMsg = '新密码不能为空';
		}
		else if(this.goldNewPwd.length < 6){
			this.goldErrorMsg = '新密码不能小于6位';
		}
		else if(this.goldNewPwd !== this.goldRepeatPwd){
			this.goldErrorMsg = '2次密码输入不一致';
		}
		else{
			this.goldErrorMsg = '';
			let self = this;
			let body = {"newAccountPassword":this.goldNewPwd,"nowaccountPassword":this.goldOldPwd};
			this._http.postJson("account/update/self/account/password",body,function(res){
				if(res.code == '000000'){
					self.showUserInformation = false;
					Window._alert("修改资金密码成功");
				}
				else{
					self.goldErrorMsg = res.message;
				}
			},false);
		}
	}
	/* 充值资金密码 */
	resetGoldPwd(){
		let self = this;
		this._http.postJson("account/reset/self/account/password",{"AccountV":{}},function(res){
			if(res.code == '000000'){
				self.showUserInformation = false;
				Window._confirm([{"name":"提示","value":"重置成功,请去邮箱修改密码"}],function(){});
			}
			else{
				self.goldErrorMsg = res.message;
			}
		},false);
	}
	/* 更换账号 */
	changeAccount(){
		Window.openReconnect = false;
		Window.socket.close();
		this.router.navigate(['/login']);
		nwOption.loginPage();
	}
}
