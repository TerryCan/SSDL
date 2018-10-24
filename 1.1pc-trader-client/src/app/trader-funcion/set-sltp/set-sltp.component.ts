import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';
declare var Window;
@Component({
	selector: 'app-set-sltp',
	templateUrl: './set-sltp.component.html',
	styleUrls: ['./set-sltp.component.css']
})
export class SetSltpComponent implements OnInit {

	constructor(private _http:HttpService) { }

	ngOnInit() {
		
	}
	public price:number;
	positionPrice:number;
	num:number;
	dir:number;
	win:number;
	loss:number;
	winFlag:boolean = true;
	lossFlag:boolean = true;
	proId:string;
	name:string;
	vol:number;
	public sl;
	public tp;
	positionId:string;
	unionMinPrices:number;
	unionMinPricesFloatNumber:number;
	/* 设置止盈/止损 */
	setSLTP:boolean = false;
	/* 是否全部设 */
	allSame:boolean = false;

	/* 档位 */
	SLdang:number = 0;
	TPdang:number = 0;
	public showWinLoss = (name,price,positionPrice,vol,dir,proId,positionId = '',sl = 0,tp = 0)=>{
		this.setSLTP = true;
		this.name = name;
		this.price = price;
		this.positionPrice = positionPrice;
		this.dir = dir;
		this.proId = proId;
		this.vol = vol;
		this.positionId = positionId;

		for(let i=0,r=Window.productList.length;i<r;i++){
			if(Window.productList[i].productId == proId){
				this.unionMinPrices = Window.productList[i].unionMinPrices;
				this.unionMinPricesFloatNumber = this.unionMinPrices.toString().split(".")[1].length;
				break;
			}
		}
		this.sl = sl==0?price.toFixed(this.unionMinPricesFloatNumber):sl.toFixed(this.unionMinPricesFloatNumber);
		this.tp = tp==0?price.toFixed(this.unionMinPricesFloatNumber):tp.toFixed(this.unionMinPricesFloatNumber);

		this.SLdang = sl==0?0:(sl-price)/this.unionMinPrices;
		this.TPdang = tp==0?0:(tp-price)/this.unionMinPrices;
	}
	setWinLoss():void {
		this.tp = this.winFlag?this.tp:0;
		this.sl = this.lossFlag?this.sl:0;
		let self = this;
		let body = {"orderRequestVIce":
						{
							"productId":this.proId,
							"positionId":this.allSame?'':this.positionId,
							"sl":this.sl,
							"tp":this.tp,
							"orderDirect":this.dir
						}
					}
		this._http.postJson('trade/position/sltp',body,function(data){
			if(data.code == '000000'){
				Window._alert('设置成功');
				self.setSLTP = false;
			}
		});
	}
	changeTP(){
		this.TPdang = Math.round((this.tp-this.price)/this.unionMinPrices);
	}
	changeSL(){
		this.SLdang = Math.round((this.sl-this.price)/this.unionMinPrices);
	}

}
