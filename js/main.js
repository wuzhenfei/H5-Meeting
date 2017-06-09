/***** 加载事件 *****/
var etControl = {};
etControl.process = function (config) {
    /*需要放在html中的body标签后面使用本控件*/
    var count = 0;    
    /*更新进度条*/
    this.updateProcess = function (percent) {
        setTimeout(function(){
        	//$('.loading').animate({ width: percent + "%" });  //加载进度条
        	$(".loadnumber").text(percent + "%");
        }, ++count * 800);
        if (percent == 100) {           	/*100%就从页面移除loading标签*/
            setTimeout(function () {
                $('#loading').slideUp(500);
            }, count * 500 + count * 500);
        }        
    };
}

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
	app.sound.bg = new Audio('sound/bg.mp3');
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
			if($(".s1 header h4").text()=='2017'){
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

});
