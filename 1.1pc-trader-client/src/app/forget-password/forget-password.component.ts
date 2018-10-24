import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../http.service';
declare var Window,nwOption;
@Component({
	selector: 'app-forget-password',
	templateUrl: './forget-password.component.html',
	styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

	constructor(private _http:HttpService,private router: Router) { }
	currentStep = 1;

	/* 信息变量 */
	orgCode:string = '';
	loginInfo:string = '';

	orgCodeError:string = '';
	loginInfoError:string = '';

	checkCode:string = '';
	password:string = '';
	repeatPassword:string = '';

	checkCodeError:string = '';
	passwordError:string = '';
	repeatPasswordError:string = '';

	ngOnInit() {
		nwOption.forgetPassword();
	}
	/* 返回 */
	goBack(){
		this.router.navigate(['/login']);
	}
	/* 邮件发送倒计时 */
	public countDown:number = 60;
	public beginCountDown:boolean = false;
	public countDownText:string = '重新获取验证码';
	getcheckCode(){
		if(this.beginCountDown){
			return;
		}
		let self = this;
		this._http.postJson("user/forget/password/step1",{"orgCode":this.orgCode,"loginName":this.loginInfo},function(res){
			Window._alert("邮箱验证码已发送至邮箱,请注意查收");
			self.countDownEffect();
		});
	}
	countDownEffect(){
		this.beginCountDown = true;
		this.countDownText = this.countDown+'秒后再次获取';
		let t = setInterval(()=>{
			if(this.countDown > 0){
				this.countDown--;
				this.countDownText = this.countDown+'秒后再次获取';
			}
			else{
				clearInterval(t);
				this.beginCountDown = false;
				this.countDown = 60;
				this.countDownText = '重新获取验证码';
			}
		},1000);
	}
	private preventStep:boolean = false;
	step(num){
		if(this.preventStep){
			return;
		}
		let error = 0;
		let self = this;
		switch (num) {
			case 1:
				this.orgCodeError = '';
				this.loginInfoError = '';
				if(this.orgCode == ''){
					this.orgCodeError = '机构码不能为空';
					error++;
				}
				if(this.loginInfo == ''){
					this.loginInfoError = '登录信息不能为空';
					error++;
				}
				if(error == 0){
					this.preventStep = true;
					this._http.postJson("user/forget/password/step1",{"orgCode":this.orgCode,"loginName":this.loginInfo},function(res){
						Window._alert("邮箱验证码已发送至邮箱,请注意查收");
						self.currentStep = 2;
						self.countDownEffect();
						self.preventStep = false;
					});
				}
				break;
			case 2:
				this.checkCodeError = '';
				this.passwordError = '';
				this.repeatPasswordError = '';
				if(this.checkCode == ''){
					this.checkCodeError = '邮箱验证码不能为空';
					error++;
				}
				if(this.password == ''){
					this.passwordError = '新密码不能为空';
					error++;
				}
				else if(this.password.length < 6){
					this.passwordError = '新密码长度不能小于6位';
					error++;
				}
				if(this.repeatPassword !== this.password){
					this.repeatPasswordError = '2次密码输入不一致';
					error++;
				}
				if(error == 0){
					this.preventStep = true;
					this._http.postJson("user/forget/password/step2",{"code":this.checkCode,"password":this.password},function(res){
						if(res.code == '000000'){
							Window._confirm([{"name":"提示","value":"密码修改成功,请重新登录"}],function(){
								self.router.navigate(['/login']);
							});
						}
						else{
							Window._alert(res.message)
						}
						self.preventStep = false;

					},false);
				}
				break;
		}
	}
}
