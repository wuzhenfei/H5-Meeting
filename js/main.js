

$(function(){

	/***** 全局参数 *****/
	var app = window.app || {};
	app.ios = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
	app.weixin = !!navigator.userAgent.match(/micromessenger/i);
	app.width = $(window).width();
	app.height = $(window).height();
	app.ratio = window.devicePixelRatio?window.devicePixelRatio:1;
	app.isTouch = window.ontouchstart===undefined ? false : true;
	app.evtDown = app.isTouch?"touchstart":"mousedown";
	app.evtMove = app.isTouch?"touchmove":"mousemove";
	app.evtUp = app.isTouch?"touchend":"mouseup";
	app.evtClick = app.isTouch?"tap":"click";
	
	
	/***** 音频 *****/
	app.sound = {};
	app.sound.mute = false;
	app.sound.msg = new Audio('sound/msg.mp3');
	app.sound.bg = new Audio();
	app.sound.dh1 = new Audio('sound/dh1.mp3');
	app.sound.dh3 = new Audio('sound/dh3.mp3');
	app.sound.dh4 = new Audio('sound/dh4.mp3');
	app.sound.dh5 = new Audio('sound/dh5.mp3');
	app.sound.dh7 = new Audio('sound/dh7.mp3');
	app.sound.dh8 = new Audio('sound/dh8.mp3');
	app.sound.bg._loop = true;
	for(var i in app.sound){
		if(!app.sound[i].play){ continue;  }
		app.sound[i]._play = app.sound[i].play;
		app.sound[i].play = function(){ !app.sound.mute && this._play(); }
		app.sound[i].addEventListener('ended', function(e){
			if(e.target._loop){ e.target.play(); }
		});
	}
	$("body").one(app.evtDown, function(){
		for(var i in app.sound){
			if(!app.sound[i].load){ continue;  }
			app.sound[i].load();
		}
	});
	
	
	/***** 获取URL参数 *****/
	function GetQueryString(name) {
	   var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
	   var r = window.location.search.substr(1).match(reg);
	   if (r!=null) return decodeURIComponent(r[2]); return null;
	}
	
	
	/***** 自定义tap事件 *****/
	if(app.isTouch){
		 $.event.special.tap = {
	        setup: function () {
	            $(this).on('touchstart.tap', function (e) {
	                $(this).data('@tap_startTime', e.timeStamp);
	            });
	            $(this).on('touchmove.tap', function (e) {
	                $(this).removeData('@tap_startTime');
	            });
	            $(this).on('touchend.tap', function (e) {
	                if($(this).data('@tap_startTime') && e.timeStamp-$(this).data('@tap_startTime')<800){
	                	$(this).removeData('@tap_startTime');
	                	var myevt=$.Event("tap");
	                	myevt.originalEvent=e.originalEvent;
	                	setTimeout(function(){ $.event.trigger(myevt, null, e.target); }, 100);
	                	//return false;
	                	//window.clearTimeout(this.tap_timer);
	                	//this.tap_timer=window.setTimeout(function(){ $.event.trigger(myevt, null, e.target); });
	                } 
	            });
	        },
	        teardown: function () {
	        	$(this).off('touchstart.tap').off('touchmove.tap').off('touchend.tap');
	            $.event.remove(this, 'tap');
	            $.removeData(this, '@tap_startTime');
	            //this.tap_timer=undefined;
	        }
	    };
		$.fn.tap = function (callback) { // tap快捷方式
		    return this.on('tap', callback);
		};
	}
	
	
	/***** 提示弹窗 *****/
	function myAlert(info, callback){
		var html='';
		if(info===undefined){ info = ''; }
		if(info===null){ info = 'null'; }
		if(typeof(info)==='boolean'){ info= info?'true':'false'; }
		html+='<div class="alert"><article>';
		html+='<header>'+info+'</header>';
		html+='<footer><a>确定</a></footer>';
		html+='</article></div>';
		html=$(html);
		html.find('footer').on(app.evtClick, function(){
			var div = $(this).parents('.alert');
			div.addClass('alert_out');
			setTimeout(function(){ 
				div.remove();
				if(typeof(callback)=='function'){ callback(); }
			},350);
		})
		$('body').append(html);
	}
	
	
	/***** 设置文档标题 *****/
	function setTitle(title){
//		document.title = title;
//		var $iframe = $('<iframe style="display:none" src="/favicon.ico?r='+Math.floor(Math.random()*1000000)+'"></iframe>').one('load', function() {
//			var _this = $(this);
//			setTimeout(function() { _this.remove();	}, 0);
//		}).appendTo($('body'));
	}
	
	
	/***** 滚动到底部 *****/
	function scrollBottom(speed, callback){
		if(!speed || typeof(speed)!='number' || speed<=0){
			window.scrollTo(0, document.body.scrollHeight);
			typeof(callback)=="function" && callback();
		}else{
			if(speed>20){ speed=20; }
			window._scroll_timer = window.setInterval(function(){
				var scrollMax = document.documentElement.scrollHeight-document.documentElement.clientHeight;
				if(window.scrollY>=scrollMax-1){ 
					window.clearInterval(window._scroll_timer); 
					window.scrollTo(0, scrollMax);
					typeof(callback)=="function" && callback();
					return;
				}
				window.scrollTo(0, window.scrollY+speed);
			}, 17);
		}
	}
	
	
	/***** s1 *****/
	$(".s1 footer").on(app.evtClick, 'i', function(){
		var num = parseInt($(this).text());
		var tid = $(".s1 header h4 i:empty:first").index();
		if(tid<0){ tid = $(".s1 header h4 i").length; }
		if($(this).index()==11){
			$(".s1 header h4 i").eq(tid-1).empty();
		}else if(!isNaN(num)){
			$(".s1 header h4 i").eq(tid).text(num);
			if(tid<$(".s1 header h4 i").length-1){ return; }
			if($(".s1 header h4").text()=='1321'){
				$(".s1 footer").off(app.evtClick);
				//setTimeout(function(){ $(".s1").addClass('step2'); }, 300)
				setTimeout(function(){ $(".s1 center a").trigger(app.evtClick); }, 600);
			}else{
				$(".s1 header h4").transit({x: '6%'}, 60)
					.transit({x: '-6%'}, 60)
					.transit({x: '4%'}, 60)
					.transit({x: '-3%'}, 60)
					.transit({x: '0%'}, 60)
			}
		}
	});
	$(".s1 center a").one(app.evtClick, function(){
		$("html, body").css('background-color', '#fff');
		$(".s1").addClass('no_animation').transit({x:'-100%'}, 300, function(){ $(this).remove(); });
		$(".s2, .s2input").css({display:'block', x:'100%'}).transit({x:0}, 300);
		setTimeout(function(){ playPage2(); app.sound.bg.play();  }, 350);
	});
	
	
	/***** s2 *****/
	function playPage2(){
		var li = $(".s2 li:hidden").eq(0);
		if(li.length==0){ app.useSystemScroll=true; return; }
		li.css({display:'block', opacity:0});
		scrollBottom(10, function(){
			li.css({opacity:1});
			if(!li.children().eq(0).is('center')){ app.sound.msg.play(); }
			setTimeout(playPage2, li.attr('delay')*1000 || 2500);
		});
	}
	$(".s2 li figure a").on(app.evtClick, function(){
		app.useSystemScroll=false;
		$(".s2, .s2input").transit({x:'-100%'}, 300);
		$(".s3").css({display:'block', position:'fixed', x:'100%'}).transit({x:0}, 300, function(){
			$(".s2, .s2input, .s2packet").remove();
			setTimeout(function(){ $(".s3").attr('style', 'display:block;'); }, 100);
			setTimeout(function(){ playPage3(); }, 2000);
		});
	});
//	$(".s2 li figure a").on(app.evtClick, function(){
//		$(".s2 li a s").hide();
//		$(".s2packet").show();
//	});
//	$(".s2packet").on(app.evtMove, function(){ return false; })
//	$(".s2packet a").on(app.evtClick, function(){
//		var go_next = $(this).index();
//		$(".s2packet").addClass('no_animation').transit({opacity:0}, 200, 'linear', function(){
//			$(this).removeAttr('style').removeClass('no_animation');
//			if(go_next){
//				app.useSystemScroll=false;
//				$(".s2, .s2input").transit({x:'-100%'}, 300);
//				$(".s3").css({display:'block', position:'fixed', x:'100%'}).transit({x:0}, 300, function(){
//					$(".s2, .s2input, .s2packet").remove();
//					setTimeout(function(){ $(".s3").attr('style', 'display:block;'); }, 100);
//					setTimeout(function(){ playPage3(); }, 2000);
//				});
//			}else{
//				$(".s2 li a s").show();
//			}
//		});
//	});
	
	
	/***** s3 *****/
	app.page3_id = 0;
	function playPage3(){
		var curr = $(".s3 li").eq(app.page3_id);
		if(!curr.length){
			$(".s3 ul").css('padding-bottom', '6em');
			$(".s3>center").show();
			scrollBottom(10, function(){ app.useSystemScroll=true; }); 
			return;
		}
		if(!curr[0]._scrolled){
			curr[0]._scrolled=true;
			$('body').animate({scrollTop:curr.offset().top-10}, 300, function(){
				var key = curr.find('figure').attr('class');
				setTimeout(function(){
					curr.find('figure').addClass('ani');
					if(app.sound[key]){ app.sound[key].play();  }
					if(key=='dh5'){ $(".wrapper").addClass('dh5_shake'); setTimeout(function(){ $(".wrapper").removeClass('dh5_shake');  }, 4000); }
				}, 500);
				setTimeout(function(){ 
					if(key=='dh3'){	$(".s3 .dh3 sup").remove(); }
					if(key=='dh4'){	$(".s3 .dh4 sup").remove(); }
					if(key=='dh5'){	$(".s3 .dh5 sup").remove(); }
					playPage3();
				}, curr.attr('delay')*1000 || 2000);
			});
			return;
		}else if(!curr.find('footer').length){ 
			app.page3_id+=1;
			setTimeout(function(){ playPage3();	}, curr.attr('delay')*1000 || 2000);
			return;
		}
		curr = curr.find('footer>*:hidden:first');
		if(curr.index()===0){ curr.parent().show();	}
		if(curr.next().length===0){ app.page3_id+=1; }
		curr.show();
		app.sound.msg.play();
		setTimeout(function(){ playPage3();	}, curr.attr('delay')*1000 || 2000);
	}
	$(".s3>center a").on(app.evtClick, function(){
		app.useSystemScroll=false;
		$(".s4").show();
	});
	
	
	/***** s4 *****/
	$(".s4").on(app.evtClick, function(){
		$(this).addClass('no_animation').transit({opacity:0},200,function(){
			$(this).removeAttr('style').removeClass('no_animation');
			app.useSystemScroll=true;
		})
	});
	
	
	/***** init *****/
	if(app.ios){ //禁止ios双击屏幕上弹
		$('body').on('touchend', function(){
			var delta, time = new Date().getTime();
			if(!app._last_touchend_time){ app._last_touchend_time=time; return; }
			delta = time - app._last_touchend_time;
			app._last_touchend_time = time;
			if(delta<500){ return false; }
		});
	}
	$("body").on('contextmenu', function(e) { //禁止长按选择
		e.preventDefault();
	});
	$(".mute").on(app.evtClick, function(){ //静音按钮
		$(this).toggleClass('muted');
		if($(this).hasClass('muted')){
			app.sound.bg.pause();
		}else{
			app.sound.bg.play();
		}
	});
	if(app.weixin && window.h6app_userInfo && window.h6app_userInfo.nickname){ // 当前用户信息
		app.user = {
			name: window.h6app_userInfo.nickname,
			head: window.h6app_userInfo.headimgurl
		}
	}else{
		app.user = {
			name: '人民日报客户端用户',
			head: 'img/user'+Math.floor(Math.random()*3+1)+'.jpg'
		}
	}
	if(GetQueryString('pre_user_name') && GetQueryString('pre_user_head')){
		app.user_prev = {
			name: decodeURIComponent(GetQueryString('pre_user_name')),
			head: GetQueryString('pre_user_head')
		}
	}else{
		app.user_prev = {
			name: '小端',
			head: 'img/user_prev.jpg'
		}
	}
	
	
	/***** 应用开始 *****/
	function appBegin(){
		var sty;
		sty = '<style>\n';
		sty += 'body .user0 { background-image: url('+app.user.head+'); }\n';
		sty += 'body .user0:after { content: "'+app.user.name+'";}\n';
		sty += 'body .my_name:before { content: "'+app.user.name+'"; }\n';
		sty += 'body .user_prev {  background: url('+app.user_prev.head+') no-repeat 0 0 / 100% 100%; }\n';
		sty += 'body .user_prev:after { content: "'+app.user_prev.name+'";}\n';
		sty += '</style>';
		$("head").append(sty);
		$("img").each(function(){ $(this).attr('assetUrl') && $(this).attr('src', $(this).attr('assetUrl')); });
		$(".s4 figure").attr('class', 'type'+(app.weixin?1:2));
		setTitle('两会群聊');
		$(".asset").transit({opacity:0}, 300, 'linear', function(){
			$(this).remove();
			$(".s1").show();
			
//			$(".s2, .s2input").show();
//			playPage2();
			
//			$(".s3").show();
//			setTimeout(function(){ playPage3(); }, 2000);
			
//			app.page3_id=8;
//			$(".s3 li:eq("+app.page3_id+")").prevAll().children('figure').addClass('ani');
//			$(".s3").show();
//			setTimeout(function(){ playPage3(); }, 1000);
			
		});
		
	};
	window.appBegin=appBegin;
	
	
});
