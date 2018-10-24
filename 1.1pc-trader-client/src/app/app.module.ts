import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { Routes,RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AlertComponent } from './alert/alert.component';
import { HttpService } from './http.service';
import { SocketIoService } from './socket.io.service';
import { ProcessFunService } from './comm-fun/process-fun.service';
import { MainContainerComponent } from './main-container/main-container.component';
import { HeaderComponent } from './header/header.component';
import { MainMarketComponent } from './main-market/main-market.component';
import { FooterComponent } from './footer/footer.component';
import { MarketSourceComponent } from './market-source/market-source.component';
import { EchartsDrawComponent } from './echarts-draw/echarts-draw.component';
import { LineMainComponent } from './echarts/line-main/line-main.component';
import { LineVolComponent } from './echarts/line-vol/line-vol.component';
import { CandelMainComponent } from './echarts/candel-main/candel-main.component';
import { CandelVolComponent } from './echarts/candel-vol/candel-vol.component';
import { CandelMacdComponent } from './echarts/candel-macd/candel-macd.component';
import { EchartLoadingComponent } from './echart-loading/echart-loading.component';
import { TradeMarkComponent } from './trade-mark/trade-mark.component';
import { TraderComponent } from './trader-funcion/trader/trader.component';
import { PositionComponent } from './trader-funcion/position/position.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { SetSltpComponent } from './trader-funcion/set-sltp/set-sltp.component';
import { PositionDetailComponent } from './trader-funcion/position-detail/position-detail.component';
import { UndoneContractComponent } from './trader-funcion/undone-contract/undone-contract.component';
import { EntrustComponent } from './trader-funcion/entrust/entrust.component';
import { DealComponent } from './trader-funcion/deal/deal.component';
import { CapitalFlowComponent } from './trader-funcion/capital-flow/capital-flow.component';
import { RealTimeNewsComponent } from './information/real-time-news/real-time-news.component';
import { FinancialCalendarComponent } from './information/financial-calendar/financial-calendar.component';
import { IndexsManageComponent } from './indexs-manage/indexs-manage.component';
import { SignComponent } from './service/sign/sign.component';
import { ResignComponent } from './service/resign/resign.component';
import { GoldComponent } from './service/gold/gold.component';
import { IntoGoldComponent } from './service/into-gold/into-gold.component';
import { WithdrawalsComponent } from './service/withdrawals/withdrawals.component';
import { RechargeComponent } from './service/recharge/recharge.component';
import { TopicComponent } from './topic/topic.component';
import { UserInformationComponent } from './user-information/user-information.component';
import { RiskTipComponent } from './risk-tip/risk-tip.component';
import { RegisterComponent } from './register/register.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { HelpComponent } from './trader-funcion/help/help.component';

export const routes: Routes = [
	{path:'',component:LoginComponent, pathMatch: 'full'},
	{path:'login', component:LoginComponent},
	{path:'register', component:RegisterComponent},
	{path:'riskTip', component:RiskTipComponent},
	{path:'forgetPassword', component:ForgetPasswordComponent},
	{path:'mainContainer',component:MainContainerComponent,children:[
		{path:'mainMarket',component:MainMarketComponent},
		{path:'realTimeNews',component:RealTimeNewsComponent},
		{path:'financialCalendar',component:FinancialCalendarComponent},
		{path:'topic',component:TopicComponent}
	]}
];
@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		AlertComponent,
		MainContainerComponent,
		HeaderComponent,
		MainMarketComponent,
		FooterComponent,
		MarketSourceComponent,
		EchartsDrawComponent,
		LineMainComponent,
		LineVolComponent,
		CandelMainComponent,
		CandelVolComponent,
		CandelMacdComponent,
		EchartLoadingComponent,
		TradeMarkComponent,
		TraderComponent,
		PositionComponent,
		ConfirmComponent,
		SetSltpComponent,
		PositionDetailComponent,
		UndoneContractComponent,
		EntrustComponent,
		DealComponent,
		CapitalFlowComponent,
		RealTimeNewsComponent,
		FinancialCalendarComponent,
		IndexsManageComponent,
		SignComponent,
		ResignComponent,
		GoldComponent,
		IntoGoldComponent,
		WithdrawalsComponent,
		RechargeComponent,
		TopicComponent,
		UserInformationComponent,
		RiskTipComponent,
		RegisterComponent,
		ForgetPasswordComponent,
		HelpComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		CommonModule,
		RouterModule.forRoot(routes)
	],
	exports: [ RouterModule ],
	providers: [HttpService,SocketIoService,ProcessFunService],
	bootstrap: [AppComponent]
})
export class AppModule {

}
