import { Component, ViewChild, ElementRef,ChangeDetectorRef,OnInit,Input,OnDestroy } from '@angular/core';
import { HttpService } from '../../http.service';
import { ProcessFunService } from '../../comm-fun/process-fun.service';
/* http request */
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
/****/

declare var Window,echarts;
@Component({
	selector: 'app-candel-main',
	templateUrl: './candel-main.component.html',
	styleUrls: ['./candel-main.component.css']
})
export class CandelMainComponent implements OnInit,OnDestroy {

	candelMa;
	candelstickOption = {};

	public isLoding:Boolean = true;
	dates:Array<any> = [];
	candelTime;
	public update;
	addNewPoint:boolean = false;
	public resizeChart;

	/* MA副指标 */
	ma1;
	ma2;
	ma3;
	ma4;

	/* 数值显示 */
	hoverInfo = {
		"date_ymd":"-",
		"date_his":"-",
		"open":"-",
		"close":"-",
		"low":"-",
		"high":"-",
		"settle":"-",
		"ma5":"-",
		"ma10":"-",
		"ma20":"-",
		"ma30":"-"
	};
	showHoverInfo:boolean = false;
	public showCross;
	public drawEffect;

	constructor(private _http:HttpService,private elementRef: ElementRef,private ref: ChangeDetectorRef,private ProcessFunService:ProcessFunService) { }

	ngOnInit() {
		/* 初始化图 */
		this.drawChart();
		/* 更新图 */
		let self = this;
		/* 绘图效果 */
		this.drawEffect = (data) => {
			if(Window.candel_ma){
				let tmp_candelData = Window.__candel_data.concat().pop();
				let nowPrice = data.QLastPrice;
				if(Window.__candel_data.length > 0){
					if(Window.mainEchartType == 1440){
						tmp_candelData[0] = data.QOpeningPrice;
					}
					else{
						tmp_candelData[0] = Window.__candel_data[Window.__candel_data.length-2][1];
					}
					tmp_candelData[1] = nowPrice;
					tmp_candelData[2] = (nowPrice < tmp_candelData[2])?nowPrice:tmp_candelData[2];
					tmp_candelData[3] = (tmp_candelData[3] < nowPrice)?nowPrice:tmp_candelData[3];

					Window.__candel_data.splice(-1,1,tmp_candelData);
					if(Window.candel_ma){
						Window.candel_ma.setOption({
					        series: [{
					            data: Window.__candel_data
					        }]
					    });
					}
				}
			}

		}
		this.update = () => {
			this.ma1 = Window.MA(5,Window.CLOSE);
			this.ma2  = Window.MA(10,Window.CLOSE);
			this.ma3  = Window.MA(20,Window.CLOSE);
			this.ma4  = Window.MA(30,Window.CLOSE);
			this.setChart(Window.__candel_data,Window.__dates,Window.__candel_settle_price,this.ma1,this.ma2,this.ma3,this.ma4);
		}
		/* 绘图尺寸重加载 */
		this.resizeChart = () => {
			setTimeout(()=>{
				Window.candel_ma.resize();
			},10);
		}
		/* 是否显示cross */
		this.showCross = function(bool) {
			this.showHoverInfo = bool;
			this.update();
		}
	}
	ngOnDestroy() {
		Window.candel_ma.clear();
	}
	drawChart(){
		if(Window.__candel_data.length < 1){
			setTimeout(()=>{
				this.drawChart();
			},500);
		}
		else{
			this.candelMa = this.elementRef.nativeElement.querySelector('#candel-main');
			Window.candel_ma = echarts.init(this.candelMa);
			/* 获取历史行情 */
			this.ma1 = Window.MA(5,Window.CLOSE);
			this.ma2  = Window.MA(10,Window.CLOSE);
			this.ma3  = Window.MA(20,Window.CLOSE);
			this.ma4  = Window.MA(30,Window.CLOSE);
			this.setChart(Window.__candel_data,Window.__dates,Window.__candel_settle_price,this.ma1,this.ma2,this.ma3,this.ma4);
		}
	};
	/* 画图 */
	setChart(data,dates,settle,ma1,ma2,ma3,ma4){
		let self = this;
		this.candelstickOption = {
			animation:false,
			axisPointer: {
				link: {xAxisIndex: 'all'},
				triggerTooltip:false,
				showContent:false,
				snap:false,
				label: {
					backgroundColor: '#666',
					precision:2
				}
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'cross'
				},
				formatter : function(params) {
					self.hoverInfo.date_ymd = params[0].axisValue.split(' ')[0];
					self.hoverInfo.date_his = params[0].axisValue.split(' ')[1];
					self.hoverInfo.open = params[0].data[1];
					self.hoverInfo.close = params[0].data[2];
					self.hoverInfo.low = params[0].data[3];
					self.hoverInfo.high = params[0].data[4];
					self.hoverInfo.settle = params[1].data;
					self.hoverInfo.ma5 = params[2].data;
					self.hoverInfo.ma10 = params[3].data;
					self.hoverInfo.ma20 = params[4].data;
					self.hoverInfo.ma30 = params[5].data;
				},
				show:self.showHoverInfo,
				showContent: self.showHoverInfo
			},
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
			xAxis: [
				{
					type: 'category',
					boundaryGap: true,
					axisLine: {
						onZero: false,
						lineStyle: { color: '#333' }
					},
					axisTick: {show: false},
					splitLine: {show: false},
					axisLabel: {show: false},
					scale: true,
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
					scale: true,
					position: 'left',
					axisLine: {
						onZero: false,
						lineStyle: { color: '#666' }
					},
					splitNumber: 10,
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
					boundaryGap: ['3%', '3%'],
					position: 'right',
					axisLine: {
						onZero: false,
						lineStyle: { color: '#666' }
					},
					splitNumber: 10,
					splitLine: {
						show: false
					},
					axisLabel: {
						color: '#666',
						show: false,
						showMinLabel: false,
						showMaxLabel: false,
					},
					axisTick: {
						show: false
					},
					axisPointer:{
						label:{
							show: false
						}
					}
				}
			],
			grid: [
				{
					left: '80',
					right: '10',
					top: '10',
					bottom: '1'
				}
			],
			series: [
				{
					type: 'candlestick',
					name: '日K',
					data:data,
					markPoint: {
						itemStyle: {
							normal: {
								color: 'transparent'
							}
						},
						data: [
							{
								name: 'highest value',
								type: 'max',
								valueDim: 'highest',
								label: {
									normal: {
										show: true,
										offset:[-30,30],
										fontSize:10,
										fontWeight:100,
										textStyle:{
											color: '#fff'
										},
										formatter:"{c} →"
									}
								}
							},
							{
								name: 'lowest value',
								type: 'min',
								valueDim: 'lowest',
								label: {
									normal: {
										show: true,
										offset:[-30,23],
										fontSize:10,
										textStyle:{
											color: '#fff'
										},
										formatter:"{c} →"
									}
								}
							}
						]
					},
					itemStyle: {
						normal: {
							color: 'rgba(0,0,0, .4)',
							color0: '#00ffff',
							borderColor: '#ff0000',
							borderColor0: '#00ffff',
							borderWidth0:1
						}
					}
				},
				{
					name: 'settle',
					type: 'line',
					data: settle,
					smooth: true,
					showSymbol: false,
					lineStyle: {
						normal: {
							width: 1,
							opacity:0
						}
					},
					yAxisIndex:1
				},
				{
					name: 'MA5',
					type: 'line',
					data: ma1,
					smooth: true,
					showSymbol: false,
					lineStyle: {
						normal: {
							width: 1,
							color: '#fff'
						}
					}
				},
				{
					name: 'MA10',
					type: 'line',
					data: ma2,
					smooth: true,
					showSymbol: false,
					lineStyle: {
						normal: {
							width: 1,
							color: '#ffff00'
						}
					}
				},
				{
					name: 'MA20',
					type: 'line',
					data: ma3,
					smooth: true,
					showSymbol: false,
					lineStyle: {
						normal: {
							width: 1,
							color: '#ff33ff'
						}
					}
				},
				{
					name: 'MA30',
					type: 'line',
					data: ma4,
					smooth: true,
					showSymbol: false,
					lineStyle: {
						normal: {
							width: 1,
							color: '#0099cc'
						}
					}
				}
			]
		};
		Window.candel_ma.setOption(this.candelstickOption);
		this.isLoding = false;
	};
}
