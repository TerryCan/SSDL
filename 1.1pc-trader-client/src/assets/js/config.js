/* 基本项目配置变量 */
var baseConfig = [
	{
		"id":"zzt",
		"name":"资证通",
		"http":"https://98k.tfstock.com.cn/riskcontrol/",//http地址
		"websocket":"https://98k.tfstock.com.cn:55117",//websocket地址
		"hotLine":"021-0000-0000",//客服热线
		"riskTip":"riskTip.html",//风险提示书路径
		"registerTip":"registerTip.html",//开户提示路径
		"emergencyFlat":"emergencyFlat158",//紧急联络电话
		"recharge":"zizhengtong/views/turnBankPageFrame.html",//充值中转连接页面地址
		"webSite":"https:www.baidu.com",//官网
		"closePositionMessage":"positionCloseMessage.html",//短信紧急平仓
		"nav":[
			{"name":"用户资料","show":true,"icon":"fa fa-address-book-o","click":"userInfo"},
			{"name":"服务","show":true,"icon":"fa fa-usd","click":"","subNav":[
					{"name":"签约","show":true,"icon":"","click":"sign"},
					{"name":"换绑","show":true,"icon":"","click":"reSign"},
					{"name":"出金","show":true,"icon":"","click":"gold"},
					{"name":"入金","show":true,"icon":"","click":"intoGold"},
					{"name":"充值","show":true,"icon":"","click":"recharge"},
					{"name":"提现","show":true,"icon":"","click":"withdrawals"}
				]
			},
			{"name":"资讯","show":true,"icon":"fa fa-deaf","click":"","subNav":[
					{"name":"时事新闻","show":true,"icon":"","click":"currentNews"},
					{"name":"财经日历","show":true,"icon":"","click":"economicCalendar"}
				]
			},
			{"name":"功能","show":false,"icon":"fa fa-cubes","click":"","subNav":[
					{"name":"指标管理","show":true,"icon":"","click":"indexsManage"}
				]
			},
			{"name":"交易(F2)","show":true,"icon":"fa fa-trademark","click":"trademark"},
			{"name":"交收","show":true,"icon":"fa fa-handshake-o","click":""},
			{"name":"公告","show":true,"icon":"fa fa-bell","click":"topic"},
			{"name":"官网","show":true,"icon":"fa fa-edge","click":"webSite"},
			{"name":"交易规则","show":true,"icon":"fa fa-list-alt","click":"traderRule"}
		],
		"trader_nav":[
			{"name":"交易","icon":"fa fa-exchange","click":"trader"},
			{"name":"委托","icon":"fa fa-hand-paper-o","click":"entrust"},
			{"name":"成交","icon":"fa fa-gavel","click":"deal"},
			{"name":"资金流水","icon":"fa fa-usd","click":"goldInOut"},
			{"name":"帮助及说明","icon":"fa fa-question","click":"help"}
		]
	},
	{
		"id":"188",
		"name":"188线路",
		"http":"http://192.168.1.188:8889/riskcontrol/",
		"websocket":"http://192.168.1.188:9099",
		"hotLine":"021-0000-0000",
		"riskTip":"riskTip.html",
		"registerTip":"registerTip.html",
		"emergencyFlat":"emergencyFlat158",
		"webSite":"https:www.baidu.com",
		"closePositionMessage":"positionCloseMessage.html",
		"nav":[
			{"name":"用户资料","show":true,"icon":"fa fa-address-book-o","click":"userInfo"},
			{"name":"服务","show":true,"icon":"fa fa-usd","click":"","subNav":[
					{"name":"签约","show":true,"icon":"","click":"sign"},
					{"name":"换绑","show":true,"icon":"","click":"reSign"},
					{"name":"出金","show":true,"icon":"","click":"gold"},
					{"name":"入金","show":true,"icon":"","click":"intoGold"},
					{"name":"充值","show":true,"icon":"","click":"recharge"},
					{"name":"提现","show":true,"icon":"","click":"withdrawals"}
				]
			},
			{"name":"资讯","show":true,"icon":"fa fa-deaf","click":"","subNav":[
					{"name":"时事新闻","show":true,"icon":"","click":"currentNews"},
					{"name":"财经日历","show":true,"icon":"","click":"economicCalendar"}
				]
			},
			{"name":"功能","show":true,"icon":"fa fa-cubes","click":"","subNav":[
					{"name":"指标管理","show":true,"icon":"","click":"indexsManage"}
				]
			},
			{"name":"交易(F2)","show":true,"icon":"fa fa-trademark","click":"trademark"},
			{"name":"交收","show":true,"icon":"fa fa-handshake-o","click":""},
			{"name":"公告","show":true,"icon":"fa fa-bell","click":"topic"},
			{"name":"官网","show":true,"icon":"fa fa-edge","click":"webSite"},
			{"name":"交易规则","show":true,"icon":"fa fa-list-alt","click":"traderRule"}
		],
		"trader_nav":[
			{"name":"交易","icon":"fa fa-exchange","click":"trader"},
			{"name":"委托","icon":"fa fa-hand-paper-o","click":"entrust"},
			{"name":"成交","icon":"fa fa-gavel","click":"deal"},
			{"name":"资金流水","icon":"fa fa-usd","click":"goldInOut"},
			{"name":"帮助及说明","icon":"fa fa-question","click":"help"}
		]
	},
	{
		"id":"fdny",
		"name":"福岛能源",
		"http":"https://lhs.fdetc.com:33114/riskcontrol/",
		"websocket":"https://lhs.fdetc.com:33117",
		"hotLine":"021-0000-0000",
		"riskTip":"risk181",
		"emergencyFlat":"emergencyFlat181",
		"nav":[
			{"name":"用户资料","show":true,"icon":"fa fa-address-book-o","click":"userInfo"},
			{"name":"服务","show":true,"icon":"fa fa-usd","click":"","subNav":[
					{"name":"签约","show":true,"icon":"","click":"sign"},
					{"name":"换绑","show":true,"icon":"","click":"reSign"},
					{"name":"出金","show":true,"icon":"","click":"gold"},
					{"name":"入金","show":true,"icon":"","click":"intoGold"},
					{"name":"充值","show":true,"icon":"","click":"recharge"},
					{"name":"提现","show":true,"icon":"","click":"withdrawals"}
				]
			},
			{"name":"资讯","show":true,"icon":"fa fa-deaf","click":"","subNav":[
					{"name":"时事新闻","show":true,"icon":"","click":"currentNews"},
					{"name":"财经日历","show":true,"icon":"","click":"economicCalendar"}
				]
			},
			{"name":"功能","show":true,"icon":"fa fa-cubes","click":"","subNav":[
					{"name":"指标管理","show":true,"icon":"","click":"indexsManage"}
				]
			},
			{"name":"交易(F2)","show":true,"icon":"fa fa-trademark","click":"trademark"},
			{"name":"交收","show":true,"icon":"fa fa-handshake-o","click":""},
			{"name":"公告","show":true,"icon":"fa fa-bell","click":"topic"},
			{"name":"官网","show":true,"icon":"fa fa-edge","click":"webSite"},
			{"name":"交易规则","show":true,"icon":"fa fa-list-alt","click":"traderRule"}
		],
		"trader_nav":[
			{"name":"交易","icon":"fa fa-exchange","click":"trader"},
			{"name":"委托","icon":"fa fa-hand-paper-o","click":"entrust"},
			{"name":"成交","icon":"fa fa-gavel","click":"deal"},
			{"name":"资金流水","icon":"fa fa-usd","click":"goldInOut"},
			{"name":"帮助及说明","icon":"fa fa-question","click":"help"}
		]
	},
	{
		"id":"31",
		"name":"31环境",
		"http":"http://192.168.1.188:8889/riskcontrol/",
		"websocket":"http://192.168.1.31:9092",
		"hotLine":"021-0000-0000",
		"riskTip":"risk181",
		"emergencyFlat":"emergencyFlat181",
		"nav":[
			{"name":"用户资料","show":true,"icon":"fa fa-address-book-o","click":"userInfo"},
			{"name":"服务","show":true,"icon":"fa fa-usd","click":"","subNav":[
					{"name":"签约","show":true,"icon":"","click":"sign"},
					{"name":"换绑","show":true,"icon":"","click":"reSign"},
					{"name":"出金","show":true,"icon":"","click":"gold"},
					{"name":"入金","show":true,"icon":"","click":"intoGold"},
					{"name":"充值","show":true,"icon":"","click":"recharge"},
					{"name":"提现","show":true,"icon":"","click":"withdrawals"}
				]
			},
			{"name":"资讯","show":true,"icon":"fa fa-deaf","click":"","subNav":[
					{"name":"时事新闻","show":true,"icon":"","click":"currentNews"},
					{"name":"财经日历","show":true,"icon":"","click":"economicCalendar"}
				]
			},
			{"name":"功能","show":true,"icon":"fa fa-cubes","click":"","subNav":[
					{"name":"指标管理","show":true,"icon":"","click":"indexsManage"}
				]
			},
			{"name":"交易(F2)","show":true,"icon":"fa fa-trademark","click":"trademark"},
			{"name":"交收","show":true,"icon":"fa fa-handshake-o","click":""},
			{"name":"公告","show":true,"icon":"fa fa-bell","click":"topic"},
			{"name":"官网","show":true,"icon":"fa fa-edge","click":"webSite"},
			{"name":"交易规则","show":true,"icon":"fa fa-list-alt","click":"traderRule"}
		],
		"trader_nav":[
			{"name":"交易","icon":"fa fa-exchange","click":"trader"},
			{"name":"委托","icon":"fa fa-hand-paper-o","click":"entrust"},
			{"name":"成交","icon":"fa fa-gavel","click":"deal"},
			{"name":"资金流水","icon":"fa fa-usd","click":"goldInOut"},
			{"name":"帮助及说明","icon":"fa fa-question","click":"help"}
		]
	},
	{
		"id":"158",
		"name":"158环境",
		"http":"http://192.168.1.158:8080/riskcontrol/",
		"websocket":"http://192.168.1.158:9097",
		"hotLine":"021-0000-0000",
		"riskTip":"risk158",
		"emergencyFlat":"emergencyFlat158",
		"nav":[
			{"name":"用户资料","show":true,"icon":"fa fa-address-book-o","click":"userInfo"},
			{"name":"服务","show":true,"icon":"fa fa-usd","click":"","subNav":[
					{"name":"签约","show":true,"icon":"","click":"sign"},
					{"name":"换绑","show":true,"icon":"","click":"reSign"},
					{"name":"出金","show":true,"icon":"","click":"gold"},
					{"name":"入金","show":true,"icon":"","click":"intoGold"},
					{"name":"充值","show":true,"icon":"","click":"recharge"},
					{"name":"提现","show":true,"icon":"","click":"withdrawals"}
				]
			},
			{"name":"资讯","show":true,"icon":"fa fa-deaf","click":"","subNav":[
					{"name":"时事新闻","show":true,"icon":"","click":"currentNews"},
					{"name":"财经日历","show":true,"icon":"","click":"economicCalendar"}
				]
			},
			{"name":"功能","show":true,"icon":"fa fa-cubes","click":"","subNav":[
					{"name":"指标管理","show":true,"icon":"","click":"indexsManage"}
				]
			},
			{"name":"交易(F2)","show":true,"icon":"fa fa-trademark","click":"trademark"},
			{"name":"交收","show":true,"icon":"fa fa-handshake-o","click":""},
			{"name":"公告","show":true,"icon":"fa fa-bell","click":"topic"},
			{"name":"官网","show":true,"icon":"fa fa-edge","click":"webSite"},
			{"name":"交易规则","show":true,"icon":"fa fa-list-alt","click":"traderRule"}
		],
		"trader_nav":[
			{"name":"交易","icon":"fa fa-exchange","click":"trader"},
			{"name":"委托","icon":"fa fa-hand-paper-o","click":"entrust"},
			{"name":"成交","icon":"fa fa-gavel","click":"deal"},
			{"name":"资金流水","icon":"fa fa-usd","click":"goldInOut"},
			{"name":"帮助及说明","icon":"fa fa-question","click":"help"}
		]
	},
	{
		"id":"yqd",
		"name":"易期达",
		"http":"http://ak47.wftp-aux.com:55118/riskcontrol/",
		"websocket":"http://ak47.wftp-aux.com:55111",
		"hotLine":"021-0000-0000",
		"riskTip":"risk158",
		"emergencyFlat":"emergencyFlat158",
		"nav":[
			{"name":"用户资料","show":true,"icon":"fa fa-address-book-o","click":"userInfo"},
			{"name":"服务","show":true,"icon":"fa fa-usd","click":"","subNav":[
					{"name":"签约","show":true,"icon":"","click":"sign"},
					{"name":"换绑","show":true,"icon":"","click":"reSign"},
					{"name":"出金","show":true,"icon":"","click":"gold"},
					{"name":"入金","show":true,"icon":"","click":"intoGold"},
					{"name":"充值","show":true,"icon":"","click":"recharge"},
					{"name":"提现","show":true,"icon":"","click":"withdrawals"}
				]
			},
			{"name":"资讯","show":true,"icon":"fa fa-deaf","click":"","subNav":[
					{"name":"时事新闻","show":true,"icon":"","click":"currentNews"},
					{"name":"财经日历","show":true,"icon":"","click":"economicCalendar"}
				]
			},
			{"name":"功能","show":true,"icon":"fa fa-cubes","click":"","subNav":[
					{"name":"指标管理","show":true,"icon":"","click":"indexsManage"}
				]
			},
			{"name":"交易","show":true,"icon":"fa fa-trademark","click":"trademark"},
			{"name":"交收","show":true,"icon":"fa fa-handshake-o","click":""},
			{"name":"公告","show":true,"icon":"fa fa-bell","click":"topic"},
			{"name":"官网","show":true,"icon":"fa fa-edge","click":"webSite"},
			{"name":"交易规则","show":true,"icon":"fa fa-list-alt","click":"traderRule"}
		],
		"trader_nav":[
			{"name":"交易","icon":"fa fa-exchange","click":"trader"},
			{"name":"委托","icon":"fa fa-hand-paper-o","click":"entrust"},
			{"name":"成交","icon":"fa fa-gavel","click":"deal"},
			{"name":"资金流水","icon":"fa fa-usd","click":"goldInOut"},
			{"name":"帮助及说明","icon":"fa fa-question","click":"help"}
		]
	}
];
// var gui = require('nw.gui');
// var win = gui.Window.get();
// var nwOption = {};
// nwOption.loginPage = function(){
// 	win.setResizable(true);
// 	windowCenter(670,372);
// 	win.resizeTo(670,372);
// 	win.setMinimumSize(670,372);
// 	win.setResizable(false);
// };
// nwOption.mainContainerPage = function(){
// 	windowCenter(1280,800);
// 	win.resizeTo(1280,800);
// 	win.setResizable(true);
// 	win.setMinimumSize(1280,800);
// };
// nwOption.register = function(){
// 	win.setResizable(true);
// 	windowCenter(800,600);
// 	win.resizeTo(800,600);
// 	win.setResizable(false);
// };
// nwOption.forgetPassword = function(){
// 	win.setResizable(true);
// 	windowCenter(600,300);
// 	win.resizeTo(600,300);
// 	win.setResizable(false);
// };
// function windowCenter(w,h){
// 	var windowW = window.screen.width;
// 	var windowH = window.screen.height;
// 	win.x = (windowW-w)/2;
// 	win.y = (windowH-h)/2;
// }