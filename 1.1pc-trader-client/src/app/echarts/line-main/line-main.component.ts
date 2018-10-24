import { Component ,OnInit,AfterViewInit,ElementRef,ChangeDetectorRef,Input,OnDestroy} from '@angular/core';
import { HttpService } from '../../http.service';
import { ProcessFunService } from '../../comm-fun/process-fun.service';
import { EchartLoadingComponent } from '../../echart-loading/echart-loading.component';
/* http request */
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
/****/

declare var Window,echarts;
@Component({
	selector: 'app-line-main',
	templateUrl: './line-main.component.html',
	styleUrls: ['./line-main.component.css']
})
export class LineMainComponent implements OnInit,OnDestroy {
	private productStamp;
	private tmp_date:Array<any> = [];
	private tmp_price:Array<any> = [];
	private tmp_rate:Array<any> = [];
	private tmp_value:Array<any> = [];
	private tmp_QAveragePrice:Array<any> = [];
	private tmp_position:Array<any> = [];
	private hasValueData;

	private tmp_averagePrice:Array<any> = [];
	private linestickOption;
	private lineMa;
	isLoding:Boolean;

	private hoverInfo = {
		"SignPriceClose":"-",
		"QChangeRate":"-",
		"QAveragePrice":"-",
		"Date":"-",
	}
	showHoverInfo:boolean = false;
	public showCross;
	public resizeChart;
	private datesLength:number;
	public update;
	public drawEffect;

	constructor(private _http:HttpService,private elementRef: ElementRef,private ref: ChangeDetectorRef,private ProcessFunService:ProcessFunService) {
		//
	}

	ngOnInit() {
		this.isLoding = true;
		this.lineMa = this.elementRef.nativeElement.querySelector('#line-main');
		Window.line_ma = echarts.init(this.lineMa);
		this.getData();
		/* 绘图效果 */
		this.drawEffect = (data) => {
			if(Window.__QLastPrice.length > 1 && typeof(this.linestickOption) == 'object'){
				let newPrice = data.QLastPrice;
				Window.__QLastPrice.splice(-1,1,newPrice);
				this.linestickOption.series[0].data = Window.__QLastPrice;
				Window.line_ma.setOption(this.linestickOption);
			}
		}
		/* 更新图 */
		this.update = () => {
			this.linestickOption.xAxis[0].data = Window.__lineDates;
			this.linestickOption.series[0].data = Window.__QLastPrice;
			this.linestickOption.series[1].data = Window.__QAveragePrice;
			this.linestickOption.series[2].data = Window.__QChangeRate;
			console.log(Window.__lineDates)
			Window.line_ma.setOption(this.linestickOption);
		}
		/* 是否显示cross */
		this.showCross = function(bool) {
			this.showHoverInfo = bool;
			this.linestickOption.tooltip.show = this.showHoverInfo;
			Window.line_ma.setOption(this.linestickOption);
		}
		/* 绘图尺寸重加载 */
		this.resizeChart = function(){
			setTimeout(()=>{
				Window.line_ma.resize();
			},10);
		}
	}
	ngOnDestroy() {
		Window.line_ma.clear();
	}
	/* 获取历史行情 */
	private getData(){
		console.log(Window.__lineDates)
		if(Window.__lineDates.length < 1379){
			setTimeout(()=>{
				this.getData();
			},500);
		}
		else{
			this.setChart(Window.__lineDates,Window.__QLastPrice,Window.__QChangeRate,Window.__QAveragePrice);
		}
	}
	/* 画图 */
	private setChart(tmp_date,tmp_price,tmp_rate,tmp_QAveragePrice) {
		let self = this;
		this.linestickOption = {
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'cross'
				},
				formatter : function(params) {
					self.hoverInfo.SignPriceClose = params[0]?params[0].data:'-';
					self.hoverInfo.Date = params[0]?params[0].axisValue:'-';
					self.hoverInfo.QAveragePrice = params[1]?(params[1].data).toFixed(3):'-';
					self.hoverInfo.QChangeRate = (params[2])?(params[2].data).toFixed(3):'-';
				},
				show:this.showHoverInfo
			},
			axisPointer: {
				link: {xAxisIndex: 'all'},
				snap:true,
				label: {
					backgroundColor: '#666'
				}
			},
			legend: {
				left: '10%'
			},
			grid: [
				{
					left: '70',
					right: '70',
					top: '10',
					bottom: '1'
				}
			],
			animation:false,
			dataZoom: [
				{
					type: 'slider',
					show: false,
					throttle:100,
					start: 0,
					end: 100,
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
					data: tmp_date,
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
					scale: true,
					position: 'right',
					axisLine: {
						onZero: false,
						lineStyle: { color: '#666' }
					},
					splitNumber: 10,
					splitLine: {
						show: false,
						lineStyle: {
							color: '#333',
							type: 'solid'
						}
					},
					axisLabel: {
						color: '#666',
						showMinLabel: false,
						showMaxLabel: false,
						formatter: '{value} %'
					},
					axisTick: {
						show: false
					}
				}
			],
			series: [
				{
					type: 'line',
					name:'tmp_price',
					showSymbol: false,
					hoverAnimation: false,
					data: tmp_price,
					itemStyle: {
						normal: {
							color: '#fff'
						}
					},
					lineStyle: {
						normal: {
							width: 1
						}
					}
				},
				{
					type: 'line',
					name:'tmp_QAveragePrice',
					showSymbol: false,
					hoverAnimation: false,
					data: tmp_QAveragePrice,
					itemStyle: {
						normal: {
							color: '#ffff00'
						}
					},
					lineStyle: {
						normal: {
							width: 1
						}
					}
				},
				{
					type: 'line',
					name:'tmp_rate',
					showSymbol: false,
					hoverAnimation: false,
					data: tmp_rate,
					itemStyle: {
						normal: {
							color: '#ffff00'
						}
					},
					lineStyle: {
						normal: {
							width: 1,
							opacity:0
						}
					},
					yAxisIndex:1
				}
			],
		};
		Window.line_ma.setOption(this.linestickOption);
		this.isLoding = false;
	}
}
