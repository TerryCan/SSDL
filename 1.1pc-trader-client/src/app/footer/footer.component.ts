import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpService } from '../http.service';
import { SocketIoService } from '../socket.io.service';
declare var Window;
@Component({
	selector: 'app-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit,OnDestroy {
	private connection;
	constructor(private _http:HttpService,private _socket:SocketIoService) {}
	localTime:string;
	wifiStatus:string;
	showTopic:boolean = false;
	topic = {
		title:'',
		createUserLoginName:'',
		createTime:'',
		content:''
	};

	ngOnInit() {
		let self = this;
		setInterval(()=>{
			this.getLocalTime();
		},1000);
		/* 网络信号强度 */
		Window.WifiStatus = (status)=>{
			this.wifiStatus = status;
		}
		this.getNoticeList();
		setTimeout(()=>{
			self.connection = self._socket.getNotice().subscribe(data => {
				self.getNoticeList();
			})
		},2000);
		Window.WifiStatus("connect");
	}
	ngOnDestroy() {
		this.connection.unsubscribe();
	}
	/* 获取公告列表 */
	getNoticeList() {
		let self = this;
		this._http.postForm("notice/query/by/user",{page:1,rows:999},function(res){
			let data = JSON.parse(res.content).content;
			if(data.length > 0){
				self.topic = data[0];
			}
		});
	}
	/* 获取本地时间 */
	getLocalTime(){
		var date = new Date();
		var year = date.getFullYear();
		var month = date.getMonth()+1;
		var day = date.getDate();
		var hour = date.getHours();
		var minute = date.getMinutes();
		var second = date.getSeconds();
		this.localTime = year+'年'+month+'月'+day+'日 '+hour+':'+minute+':'+second;
	}
}
