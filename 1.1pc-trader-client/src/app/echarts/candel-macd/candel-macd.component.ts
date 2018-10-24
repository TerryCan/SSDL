import { Component, ViewChild, ElementRef,ChangeDetectorRef,OnInit,Input,OnDestroy } from '@angular/core';
import { HttpService } from '../../http.service';
/* http request */
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
/****/

declare var Window,echarts;

@Component({
	selector: 'app-candel-macd',
	templateUrl: './candel-macd.component.html',
	styleUrls: ['./candel-macd.component.css']
})
export class CandelMacdComponent implements OnInit,OnDestroy {
	@Input() candeldata;
	@Input() time:string;
	private candelstickOption = {};

	private candelMacd;

	public isLoding:Boolean = true;
	private candelData:Array<any> = [];
	private dates:Array<any> = [];
	private candelTime;
	public update;
	showHoverInfo:boolean = false;
	public resizeChart;
	public showCross;
	hoverInfo = {
		"diff":'',
		"dea":'',
		"macd":''
	};

	constructor(private _http:HttpService,private elementRef: ElementRef,private ref: ChangeDetectorRef) { }

	ngOnInit() {
		this.drawChart();
		/* 更新图 */
		this.update = () => {
			if(Window.candel_macd){
				this.setChart(Window.MACD(Window.CLOSE,12,26,9),Window.__dates);
			}
		}
		/* 绘图尺寸重加载 */
		this.resizeChart = () => {
			setTimeout(()=>{
				Window.candel_macd.resize();
			},10);
		}
		/* 是否显示cross */
		this.showCross = function(bool) {
			this.showHoverInfo = bool;
			this.update();
		}
	}
	ngOnDestroy() {
		Window.candel_macd.clear();
	}
	drawChart(){
		if(Window.CLOSE.length < 1){
			setTimeout(()=>{
				this.drawChart();
			},500);
		}
		else{
			this.candelMacd = this.elementRef.nativeElement.querySelector('#candel-macd');
			Window.candel_macd = echarts.init(this.candelMacd);
			/* 获取历史行情 */
			this.setChart(Window.MACD(Window.CLOSE,12,26,9),Window.__dates);
		}
	};
	/* 画图 */
	private setChart(macd,dates){
		var min = Math.min.apply(null,macd[2]),
		max = Math.max.apply(null,macd[2]);
		let self = this;
		this.candelstickOption = {
			animation:false,
			axisPointer: {
				link: {xAxisIndex: 'all'},
				triggerTooltip:false,
				showContent:false,
				snap:false,
				label: {
					backgroundColor: '#666'
				}
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'cross'
				},
				show:self.showHoverInfo,
				showContent: self.showHoverInfo,
				formatter : function(params){
					self.hoverInfo.diff = params[0].data;
					self.hoverInfo.dea = params[1].data;
					self.hoverInfo.macd = params[2].data;
				}
			},
			xAxis: [
				{
					axisTick: {show: false},
					splitLine: {show: false},
					axisLabel: {show: false},
					maxInterval: 1,
					type: 'category',
					data: dates,
					axisPointer:{
						label:{
							show: false
						}
					}
				}
			],
			yAxis: [
				{
					type: 'value',
					boundaryGap: ['3%', '3%'],
					position: 'left',
					axisLine: {
						onZero: false,
						lineStyle: { color: '#666' }
					},
					splitNumber: 5,
					splitLine: {
						show: true,
						lineStyle: {
							color: '#333',
							type: 'solid'
						}
					},
					axisLabel: {
						color: '#666',
						showMinLabel: false,
						showMaxLabel: false
					},
					axisTick: {
						show: false
					}
				},
				{
					type: 'value',
					inverse: true,
					axisLine: {
						onZero: false,
						lineStyle: { color: '#666' }
					}
				}
			],
			grid: [
				{
					left: '80',
					right: '10',
					top: '0',
					bottom: '0'
				}
			],
			dataZoom: [
				{
					show: false,
					type: 'slider',
					throttle:100,
					start:Window.candelMoveStart,
					end:Window.candelMoveEnd,
					zoomOnMouseWheel:false,
					moveOnMouseMove:false,
					preventDefaultMouseMove:false
				}
			],
			visualMap: [
				{
					pieces:[
						{
							gt: min,
							lte: 0,
							color:'#99ffff'
						},
						{
							gt: 0,
							lte: max,
							color:'#ff0000'
						}
					],
					show: false
				}
			],
			series: [
				{
					data:macd[0],
					name: 'diff',
					type: 'line',
					lineStyle:{
						normal:{
							color:'#ffff00',
							width: 1,
						}
					}
				},
				{
					data:macd[1],
					name: 'dea',
					type: 'line',
					lineStyle:{
						normal:{
							color:'#ff33ff',
							width: 1,
						}
					}
				},
				{
					data:macd[2],
					name: 'macd',
					type: 'bar',
					barWidth:2
				}
			]
		};
		Window.candel_macd.setOption(this.candelstickOption);
		this.isLoding = false;
	};
}
