import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpService } from '../http.service';
import * as $ from "jquery";
declare var Window,baseConfig,jQuery,nwOption;
@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

	constructor(private sanitizer: DomSanitizer,private _http:HttpService,private router: Router) { }
	baseConfig = JSON.parse(localStorage.getItem("baseConfig"));
	frameUrl:any;
	/* 是否阅读开户风险 标识 */
	hasRead:boolean = false;
	/* 当前步骤 */
	currentStep:number = 1;
	isEditRegisterInfo:boolean;
	ngOnInit() {
		nwOption.register();
		this.frameUrl = this.sanitizer.bypassSecurityTrustResourceUrl("/assets/localData/"+this.baseConfig.id+"/"+this.baseConfig.registerTip);
		let userInfo = JSON.parse(localStorage.getItem('userInfo'));
		let self = this;
		if(JSON.stringify(userInfo) != "{}" && userInfo.user.userState == -3){
			this.isEditRegisterInfo = true;
			this.currentStep = 3;
			
			this._http.postJson("user/get/oneself",{},function(res){
				let data = JSON.parse(res.content);

				self.email = data.email;
				self.orgCode = data.organize.orgNum;
				self.userName = data.loginName;
				self.phone = data.phone;
				self.name = data.realInfo.name;
				self.certificateValue = data.realInfo.certificateType;
				self.certificateCode = data.realInfo.certificateNo;
				self.imgId1 = data.realInfo.cpFId;
				self.imgId2 = data.realInfo.cbFId;
				self.imgId3 = data.realInfo.chFId;
				self.img1url = self.baseConfig.http+'file/download?fileId='+data.realInfo.cpFId;
				self.img2url = self.baseConfig.http+'file/download?fileId='+data.realInfo.cbFId;
				self.img3url = self.baseConfig.http+'file/download?fileId='+data.realInfo.chFId;
			});
		}
	}
	/* 返回 */
	goBack(){
		this.router.navigate(['/login']);
	}
	/* 是否获取邮箱验证码 */
	hasGetCheckPostMailCode:boolean = false;
	/* 步骤切换 */
	step(num){
		let self = this;
		switch (num) {
			case 1:
				if(this.hasRead){
					this.currentStep = 2;
				}
				break;
			case 2:
				this.verificationStep2(function(){
					self._http.postJson("user/create/online/step2",{"code":self.checkEmailCode,"orgCode":self.orgCode},function(){
						self.currentStep = 3;
					});
				},true);
				break;
			case 3:
				this.toRegister();
				break;
		}
	}
	/* 步骤二 变量 */
	email:string = '';
	phone:string = '';
	orgCode:string = '';
	checkEmailCode:string = '';

	emailError:string = '';
	phoneError:string = '';
	orgCodeError:string = '';
	checkEmailCodeError:string = '';

	/* 倒计时变量 */
	public countDownText = '获取验证码';
	public countDown:number = 60;
	public beginCountDown:boolean = false;
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
	/* 获取邮箱验证码 */
	getEmailCheckCode() {
		if(this.beginCountDown){
			return;
		}
		let self = this;
		this.verificationStep2(function(){
			let body = {"createUserSecurityV":{"email":self.email,"phone":self.phone},"orgCode":self.orgCode};
			self._http.postJson("user/create/online/step1",body,function(res){
				if(res.code == '000000'){
					Window._confirm([{"name":"提示","value":"邮箱验证码已发送至邮箱,请注意查收"}],function(){
						self.hasGetCheckPostMailCode = true;
						self.countDownEffect();
					},false);
				}
			});
		});
	}
	/* 步骤二验证 */
	verificationStep2(callback,post = false) {
		this.emailError = '';
		this.phoneError = '';
		this.orgCodeError = '';
		this.checkEmailCodeError = '';

		var regEmail = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
		var regPhone = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
		let errorMsgNum = 0;
		if(this.email == ''){
			this.emailError = '验证邮箱不能为空';
			errorMsgNum++;
		}
		else if(!regEmail.test(this.email)){
			this.emailError = '邮箱格式不正确';
			errorMsgNum++;
		}
		if(this.phone == ''){
			this.phoneError = '手机号不能为空';
			errorMsgNum++;
		}
		else if(!regPhone.test(this.phone)){
			this.phoneError = '手机号格式不正确';
			errorMsgNum++;
		}
		if(this.orgCode == ''){
			this.orgCodeError = '机构代码不能为空';
			errorMsgNum++;
		}
		if(post){
			if(this.checkEmailCode == ''){
				this.checkEmailCodeError = '邮箱验证码不能为空';
				errorMsgNum++;
			}
		}
		if(errorMsgNum == 0){
			callback();
		}
	}
	//修复不能更改上传图片的BUG
	click_up(id,num){
		let self = this;
		$('#'+id).click();
		$('#'+id).change(function(e){
			let obj=(<HTMLInputElement>document.getElementById(id)).files[0];
			let fr=new FileReader();
			fr.readAsDataURL(obj);
			fr.onload=function () {
			    self.uploadImg(id,num,this.result);
			};
		});
	}
	imgId1:string = '';
	imgId2:string = '';
	imgId3:string = '';

	img1url:string = '/assets/img/default_img.png';
	img2url:string = '/assets/img/default_img.png';
	img3url:string = '/assets/img/default_img.png';

	/* 第四步骤 状态提示 */
	fanalyText = '';

	/* 注册变量 */
	userName:string = '';
	password:string = '';
	name:string = '';
	certificateCode = '';
	/* 注册 */
	toRegister():void{
		if(this.userName == ''){
			Window._alert("用户名不能为空");
		}
		else if((this.password == '' || this.password.length < 6) && !this.isEditRegisterInfo){
			console.log(this.password == '',this.password.length < 6)
			Window._alert("密码不能小于6个字节");
		}
		else if(this.name == ''){
			Window._alert("姓名不能为空");
		}
		else if(this.certificateCode == ''){
			Window._alert("证件号码不能为空");
		}
		else if(this.imgId1 == ''){
			Window._alert("证件正面照不能为空");
		}
		else if(this.imgId2 == ''){
			Window._alert("证件背面照不能为空");
		}
		else if(this.imgId3 == ''){
			Window._alert("证件手持照不能为空");
		}
		else{
			let self = this;
			if(this.isEditRegisterInfo){
				let registerJSON = {
					"userRealInfoV":{
						"name":this.name,
						"certificateType":this.certificateValue,
						"certificateNo":this.certificateCode,
						"cpFId":this.imgId1,
						"cbFId":this.imgId2,
						"chFId":this.imgId3
					}
				}
				
				/* 用户重提注册申请 */
				this._http.postJson("user/save/real/info/oneself",registerJSON,function(data){
					self._http.postJson("user/open/oneself",{},function(data){
						self.currentStep = 4;
						self.fanalyText = "已重新提交注册信息,请等待审核";
						localStorage.setItem('userInfo',"{}");
					});
				});
			}
			else{
				let registerJSON = {
					"code":this.checkEmailCode,
					"orgCode":this.orgCode,
					"createUserSecurityV":{
						"email":this.email,
						"loginName":this.userName,
						"phone":this.phone,
						"password":this.password
					},
					"userRealInfoV":{
						"name":this.name,
						"certificateType":this.certificateValue,
						"certificateNo":this.certificateCode,
						"cpFId":this.imgId1,
						"cbFId":this.imgId2,
						"chFId":this.imgId3
					}
				};
				/* 用户注册 */
				this._http.postJson("user/create/online/step3",registerJSON,function(data){
					if(data.code == '000000'){
						self.currentStep = 4;
						self.fanalyText = "开户申请已提交,请等待审核";
					}
				});
			}
		}
	}
	//图片上传
	uploadImg(id,num,imgUrl){
		let baseUrl = localStorage.getItem('_http');
		var urlUpload = baseUrl + 'file/upload';
		let self = this;
		this.upload_img(urlUpload,id,function(data, status){
			if(data.code === '000000'){
				var obj = JSON.parse(data.content);
				var ImgId = obj[0].fileId;
				switch (id) {
					case "uploadImgBtn1":
						self.imgId1 = ImgId;
						self.img1url = imgUrl;
						break;
					case "uploadImgBtn2":
						self.imgId2 = ImgId;
						self.img2url = imgUrl;
						break;
					case "uploadImgBtn3":
						self.imgId3 = ImgId;
						self.img3url = imgUrl;
						break;
				}
			}
			else{
				Window._alert(data.message);
			}
		});
	};

	// 上传图片
	// url:后台访问路径 fileId:input file按钮id, btn:点击的按钮id, fileInput:接收上传图片的id
	upload_img(url, fileId,callback) {
		jQuery.ajaxFileUpload({
			url : url,
			type: 'post',
			secureuri : false,
			fileElementId : fileId,// file标签的id
			dataType : 'json',// 返回数据的类型
			data:{name:fileId},
			success : function(data, status) {
				callback(data, status);
			},
			error : function(data, status, e) {
				console.log('上传图片出错');
			}
		});
	}
	/* 证件JSON */
	certificateValue = 44;
	certificateType = [
		{
			"id" :44,
			"text" : "身份证"
		},{
			"id" :45,
			"text" : "护照"
		},{
			"id" :46,
			"text" : "军官证"
		},{
			"id" :47,
			"text" : "士兵证"
		},{
			"id" :48,
			"text" : "港澳居民来往内地通行证"
		},{
			"id" :49,
			"text" : "户口本"
		},{
			"id" :50,
			"text" : "外国护照"
		},{
			"id" :51,
			"text" : "文职证"
		},{
			"id" :52,
			"text" : "警官证"
		},{
			"id" :53,
			"text" : "台胞证"
		},{
			"id" :54,
			"text" : "回乡证"
		},{
			"id" :55,
			"text" : "解放军文职干部证"
		},{
			"id" :56,
			"text" : "武警文职干部证"
		},{
			"id" :57,
			"text" : "重号身份证"
		},{
			"id" :58,
			"text" : "其它"
		}
	];
}
