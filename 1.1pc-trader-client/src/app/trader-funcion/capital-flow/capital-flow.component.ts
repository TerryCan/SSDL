import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';

declare var $: any,Window;
@Component({
	selector: 'app-capital-flow',
	templateUrl: './capital-flow.component.html',
	styleUrls: ['./capital-flow.component.css']
})
export class CapitalFlowComponent implements OnInit {

	constructor(private _http:HttpService) { }
	optLoading:boolean = false;
	
	/* 结算方向列表 */
	ioTypeList;
	/* 流水类型列表 */
	flowTypeList;
	/* 流水状态列表 */
	flowStateList;

	/* 结算方向 */
	ioType = "";
	/* 流水类型 */
	flowType = "";
	/* 流水状态 */
	flowState = "";

	/* 起始时间 */
	startTime = '';
	/* 结束时间 */
	endTime = '';

	/* 数据输出 */
	exportData:Array<any> = [];
	ngOnInit() {
		this.ioTypeList = Window.ioType;
		this.flowTypeList = Window.flowType;
		this.flowStateList = Window.flowState;
	}
	/* 币种文字输出 */
	currencyText(value){
		for(let i=0,r=Window.currencyJson.length;i<r;i++){
			if(Window.currencyJson[i].currency == value){
				return Window.currencyJson[i].currencyCode;
			}
		}
	}
	/* 结算方向文字输出 */
	ioTypeText(value){
		for(let i=0,r=Window.ioType.length;i<r;i++){
			if(Window.ioType[i].value == value){
				return Window.ioType[i].name;
			}
		}
	}
	/* 流水类型 */
	flowTypeText(value){
		for(let i=0,r=Window.flowType.length;i<r;i++){
			if(Window.flowType[i].value == value){
				return Window.flowType[i].name;
			}
		}
	}
	/* 流水状态 */
	flowStateText(value){
		for(let i=0,r=Window.flowState.length;i<r;i++){
			if(Window.flowState[i].value == value){
				return Window.flowState[i].name;
			}
		}
	}
	/* 数据搜索 */
	search(reset = false) {
		if(reset){
			this.page = 1;
		}
		this.optLoading = true;
		let _start,_end;
		if(this.startTime){
			let start = new Date(this.startTime + ' 00:00:00');
			_start = start.getTime();
		}
		else{
			_start = '';
		}
		if(this.endTime){
			let end = new Date(this.endTime + ' 23:59:59');
			_end = end.getTime();
		}
		else{
			_end = '';
		}
		let body = {
			"page":this.page,
			"rows":this.rows,
			"order":"desc",
			"sort":"createTime",
			"search_EQ_ioType":this.ioType,
			"search_EQ_tradeType":this.flowType,
			"search_EQ_state":this.flowState,
			"search_GTE_createTime":_start,
			"search_LTE_createTime":_end
		}
		let self = this;
		this._http.postForm('account/user/io/query/page',body,function(res){
			let data = JSON.parse(res.content);
			console.log(data.content);
			self.totalData = data.totalElements;
			self.exportData = data.content;
			setTimeout(()=>{
				$("table").resizableColumns({});
				self.optLoading = false;
				self.setPage();
			},50);
		});
	}
	/* 分页 */
	page:number = 1;
	rows:number = 5;
	totalData:number = 0;
	totalPage:number = 0;
	/* 分页生成 */
	setPage(){
		if(this.totalData%this.rows == 0){
			this.totalPage = this.totalData/this.rows;
		}
		else{
			this.totalPage = Math.floor(this.totalData/this.rows)+1;
		}
	}
	/* 下一页 */
	nextPage() {
		if(this.page < this.totalPage){
			this.page += 1;
			this.search();
		}
	}
	/* 上一页 */
	prevPage() {
		if(this.page > 1){
			this.page -= 1;
			this.search();
		}
	}
	json_array(jsonObj){
		var jsonArr = [];
		var arr = Object.keys(jsonObj);
		for(var i =0;i < arr.length;i++){
			jsonArr[i] = jsonObj[i];
		}
		return jsonArr;
	}
}
