import { Component ,OnInit, AfterViewInit,ElementRef,ChangeDetectorRef,Input,OnDestroy} from '@angular/core';
import { SocketIoService } from '../../socket.io.service';
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
	selector: 'app-line-vol',
	templateUrl: './line-vol.component.html',
	styleUrls: ['./line-vol.component.css']
})
export class LineVolComponent implements OnInit,OnDestroy {
	isLoding:Boolean;

	private linVol;
	private linestickOption;

	hoverInfo = {
		"SignQty":"-",
		"QPositionQty":"-"
	};
	public showCross;
	public resizeChart;
	public update;
	showHoverInfo:boolean = false;

	constructor(private _socket:SocketIoService,private _http:HttpService,private elementRef: ElementRef,private ref: ChangeDetectorRef,private ProcessFunService:ProcessFunService) {
		//
	}

	ngOnInit() {
		this.isLoding = true;
		this.linVol = this.elementRef.nativeElement.querySelector('#line-vol');
		Window.line_vol = echarts.init(this.linVol);
		let self = this;
		this.getData();

		/* 是否显示cross */
		this.showCross = function(bool) {
			this.showHoverInfo = bool;
			this.linestickOption.tooltip.show = this.showHoverInfo;
			Window.line_vol.setOption(this.linestickOption);
		}
		/* 绘图尺寸重加载 */
		this.resizeChart = function(){
			setTimeout(()=>{
				Window.line_vol.resize();
			},10);
		}
		/* 更新图 */
		this.update = () => {
			this.linestickOption.xAxis[0].data = Window.__lineDates;
			this.linestickOption.series[0].data = Window.__SignQty;
			this.linestickOption.series[1].data = Window.__QPositionQty;
			Window.line_vol.setOption(this.linestickOption);
		}
	}
	ngOnDestroy() {
		Window.line_vol.clear();
	}
	/* 获取历史行情 */
	private getData(){
		if(Window.__lineDates.length < 1379){
			setTimeout(()=>{
				this.getData();
			},500);
		}
		else{
			this.setChart(Window.__lineDates,Window.__SignQty,Window.__QPositionQty);
		}
	}
	/* 画图 */
	private setChart(date,SignQty,QPositionQty) {
		let self = this;
		this.linestickOption = {
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'cross'
				},
				formatter : function(params) {
					self.hoverInfo.SignQty = params[0].data;
					self.hoverInfo.QPositionQty = params[1].data;
				},
				show:this.showHoverInfo
			},
			axisPointer: {
				link: {xAxisIndex: 'all'},
				label: {
					backgroundColor: '#666'
				}
			},
			grid: [
				{
					left: '70',
					right: '70',
					top: '0',
					bottom: '30'
				}
			],
			animation:false,
			dataZoom: [
		        {
		            type: 'inside',
		            start: 0,
		            end: 100
		        }
		    ],
			xAxis: [
				{
					axisTick: {show: false},
					type: 'category',
					boundaryGap: true,
					data: date,
					axisPointer:{
						label:{
							show: true
						}
					},
					splitLine: {
						show: true,
						interval: 1439,
						lineStyle: { color: '#666' }
					}
				}
			],
			yAxis: [
				{
					type: 'value',
					boundaryGap: ['0%', '5%'],
					scale: true,
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
					boundaryGap: ['0%', '3%'],
					scale: true,
					position: 'right',
					axisLine: {
						onZero: false,
						lineStyle: { color: '#666' }
					},
					splitNumber: 5,
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
						showMaxLabel: false
					},
					axisTick: {
						show: false
					}
				}
			],
			series: [
				{
					type: 'bar',
					showSymbol: false,
					hoverAnimation: false,
					name:'成交量',
					data: SignQty,
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
					showSymbol: false,
					hoverAnimation: false,
					name:'持仓量',
					data: QPositionQty,
					itemStyle: {
						normal: {
							color: '#ffffff'
						}
					},
					lineStyle: {
						normal: {
							width: 1
						}
					},
					yAxisIndex:1
				}
			]
		};
		Window.line_vol.setOption(this.linestickOption);
		this.isLoding = false;
	}
}
