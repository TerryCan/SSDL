import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';

declare var $: any,Window;
@Component({
	selector: 'app-entrust',
	templateUrl: './entrust.component.html',
	styleUrls: ['./entrust.component.css']
})
export class EntrustComponent implements OnInit {

	constructor(private _http:HttpService) { }
	optLoading:boolean = false;
	/* 商品列表 */
	productList;
	/* 买卖类型 */
	bsType;
	/* 委托类型 */
	contractType;
	/* 委托状态 */
	contractState;

	SproductId:string = '';
	SorderDirect:string = '';
	SpriceCondition:string = '';
	SorderState:string = '';
	/* 起始时间 */
	startTime = '';
	/* 结束时间 */
	endTime = '';

	/* 数据输出 */
	exportData:Array<any> = [];
	ngOnInit() {
		this.bsType = Window.sbType;
		this.contractType = Window.marketType;
		this.productList = Window.productList;
		this.contractState = this.json_array(Window.orderState);
	}
	/* 委托类型文字转换 */
	contractTypeText(value){
		for(let i=0,r=Window.marketType.length;i<r;i++){
			if(Window.marketType[i].value == value){
				return Window.marketType[i].name;
			}
		}
	}
	/* 委托状态文字转换 */
	contractStateText(value){
		return Window.orderState[value].name;
	}
	/* 数据搜索 */
	search(reset = false) {
		console.log(this.startTime);
		if(reset){
			this.page = 1;
		}
		this.optLoading = true;
		let body = {
			"page":this.page,
			"rows":this.rows,
			"order":"desc",
			"sort":"createTime",
			"search_EQ_productId":this.SproductId,
			"search_EQ_orderDirect":this.SorderDirect,
			"search_EQ_priceCondition":this.SpriceCondition,
			"search_EQ_orderState":this.SorderState,
			"search_GTE_createTime":this.startTime,
			"search_LTE_createTime":this.endTime == ''?'':this.endTime+' 23:59:59'
		}
		let self = this;
		this._http.postForm('trade/order/query/as/page',body,function(res){
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
