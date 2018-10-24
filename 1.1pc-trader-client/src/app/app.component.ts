import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertComponent } from './alert/alert.component';
import { ConfirmComponent } from './confirm/confirm.component';

declare var Window;
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	title = 'app';
	@ViewChild(AlertComponent) _alert: AlertComponent;
	@ViewChild(ConfirmComponent) _confirm: ConfirmComponent;
	constructor(private router: Router) {
		/* 是否开启重连 */
		Window.openReconnect = false;
		/* 委托状态 */
		Window.orderState = {
			0:{"name": "指令失败"},
			1:{"name": "已受理"},
			2:{"name": "已挂起"},
			3:{"name": "已排队"},
			4:{"name": "待撤销"},
			5:{"name": "待修改"},
			6:{"name": "部分撤单"},
			7:{"name": "完全撤单"},
			8:{"name": "部分成交"},
			9:{"name": "全成交"},
			10:{"name": "部分成交还在队列中"},
			11:{"name": "部分成交不在队列中"},
			12:{"name": "未成交还在队列中"},
			13:{"name": "未成交不在队列中"},
			14:{"name": "撤单"},
			15:{"name": "未知"},
			16:{"name": "尚未触发"},
			17:{"name": "已触发"}
		};
		//结算方向
		Window.ioType = [
			{"value":1,"name":"汇入"},
			{"value":-1,"name":"汇出"},
		]
		//流水状态
		Window.flowState = [
			{"value":0,"name":"待审核"},
			{"value":8888,"name":"无效流水"},
			{"value":9999,"name":"有效流水"}
		]
		//流水类型
		Window.flowType = [
			{"value":0,"name":"出入金流水"},
			{"value":2,"name":"资金内部自动转换"},
			{"value":3,"name":"银行调账流水"},
			{"value":4,"name":"资金冻结解冻流水"},
			{"value":5,"name":"盈亏流水"},
			{"value":6,"name":"仓息流水"},
			{"value":7,"name":"手续费流水"}
		]
		//买卖
		Window.sbType = [
			{"value":1,"name":"买"},
			{"value":-1,"name":"卖"}
		]
		//限价 市价
		Window.marketType = [
			{"value":0,"name":"限价挂单"},
			{"value":1,"name":"市价成交单"}
		]
		//委托单请求
		Window.requestType = [
			{"value":1,"name":"委托报单"},
			{"value":2,"name":"委托改单"}
		]
		//委托单原因
		Window.requestReason = [
			{"value":0,"name":"报单"},
			{"value":1,"name":"强平"},
			{"value":2,"name":"逐笔强平"},
			{"value":3,"name":"止损"},
			{"value":4,"name":"止盈"},
			{"value":5,"name":"强平重发"}
		]
	}
	ngOnInit() {
		let self = this;
		Window._alert = function(content){
			self._alert.msg(content);
		};
		Window._confirm = function(content,callback,cancel = true){
			self._confirm.viewConfirm(content,callback,cancel);
		}
		//this.router.navigate(['/login']);
	}
}
