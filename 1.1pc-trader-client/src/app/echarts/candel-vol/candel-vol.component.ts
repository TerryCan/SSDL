import { Component, ViewChild, ElementRef,ChangeDetectorRef,OnInit,Input,OnDestroy } from '@angular/core';
import { HttpService } from '../../http.service';
/* http request */
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
/****/

declare var Window,echarts;

@Component({
	selector: 'app-candel-vol',
	templateUrl: './candel-vol.component.html',
	styleUrls: ['./candel-vol.component.css']
})
export class CandelVolComponent implements OnInit,OnDestroy {
	private candelstickOption = {};

	private candelVol;

	public isLoding:Boolean = true;
	private candelData:Array<any> = [];
	private dates:Array<any> = [];
	private volumn:Array<any> = [];
	private candelTime;
	public update;
	private connection;
	showHoverInfo:boolean = false;
	public resizeChart;
	public showCross;
	hoverInfo = {
		"vol":'',
		"ma1":'',
		"ma2":''
	};

	constructor(private _http:HttpService,private elementRef: ElementRef,private ref: ChangeDetectorRef) { }

	ngOnInit() {
		this.drawChart();
		/* 更新图 */
		this.update = () => {
			if(Window.candel_vol){
				this.setChart(Window.__dates,Window.__volumn);
			}
		}
		/* 绘图尺寸重加载 */
		this.resizeChart = () => {
			setTimeout(()=>{
				Window.candel_vol.resize();
			},10);
		}
		/* 是否显示cross */
		this.showCross = function(bool) {
			this.showHoverInfo = bool;
			this.update();
		}
	}
	ngOnDestroy() {
		Window.candel_vol.clear();
	}
	drawChart(){
		if(Window.__volumn.length < 1){
			setTimeout(()=>{
				this.drawChart();
			},500);
		}
		else{
			this.candelVol = this.elementRef.nativeElement.querySelector('#candel-vol');
			Window.candel_vol = echarts.init(this.candelVol);
			/* 获取历史行情 */
			this.setChart(Window.__dates,Window.__volumn);
		}
	};
	/* 画图 */
	private setChart(dates,volume){
		let self = this;
		let volumeColor = Window.colorVolList(Window.CLOSE);
		let volMA5 = Window.MA(5,volume);
		let volMA10 = Window.MA(10,volume);
		this.candelstickOption = {
			animation:false,
			axisPointer: {
				link: {xAxisIndex: 'all'},
				triggerTooltip:false,
				showContent:false,
				snap:true,
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
				formatter : function(params) {
					self.hoverInfo.vol = params[0].data;
					self.hoverInfo.ma1 = params[1].data;
					self.hoverInfo.ma2 = params[2].data;
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
							show: true
						}
					}
				}
			],
			yAxis: [
				{
					type: 'value',
					boundaryGap: ['0%', '3%'],
					position: 'left',
					axisLine: {
						lineStyle: { color: '#666' }
					},
					splitNumber: 3,
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
						lineStyle: { color: '#666' }
					}
				}
			],
			grid: [
				{
					left: '80',
					right: '10',
					top: '0',
					bottom: '30'
				}
			],
			dataZoom: [
				{
					type: 'slider',
					show: false,
					throttle:100,
					start:Window.candelMoveStart,
					end:Window.candelMoveEnd,
					zoomOnMouseWheel:false,
					moveOnMouseMove:false,
					preventDefaultMouseMove:false
				}
			],
			series: [
				{
					name: 'VOLUME',
					type: 'bar',
					data: volume,
					lineStyle: {
						normal: {
							color: '#ffff00',
							width: 1
						}
					},
					itemStyle: {
						normal: {
							color: function(params) {
								return volumeColor[params.dataIndex];
							}
						}
					}
				},
				{
					name: 'volMA5',
					type: 'line',
					data: volMA5,
					lineStyle: {
						normal: {
							width: 1,
							color: '#fff'
						}
					}
				},
				{
					name: 'volMA10',
					type: 'line',
					data: volMA10,
					lineStyle: {
						normal: {
							width: 1,
							color: '#ffff00'
						}
					}
				}
			]
		};
		Window.candel_vol.setOption(this.candelstickOption);
		this.isLoding = false;
	};

}
