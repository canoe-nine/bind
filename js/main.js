var start = document.getElementById("start");
var title = document.getElementById("title");
var flyBird = document.getElementById("flyBird");
var box = document.getElementById("box");
var ul=document.getElementsByTagName("ul")[0];
var scoreBoard=document.getElementById("scoreBoard");
var audios=document.getElementsByTagName("audio");
var downTimer = null;
var upTimer = null;
var pipeTimer=null;
var crashTimer=null;
var speed = 0;
var maxSpeed = 8;
var scoreNum=0;

function downBird() {
	flyBird.src = "img/down_bird0.png";
	//设置初始速度为0，由于受到重力作用，小鸟的下降速度跟着计时器每30毫秒增加0.7，但是速度不能无限增大，加了一个阈（yu）值
	speed += .3;
	if(speed >= maxSpeed) {
		speed = maxSpeed
	}
	flyBird.style.top = flyBird.offsetTop + speed + "px"
}
function random(min,max){
	return Math.random()*(max-min)+min
}
function addScore(){
	scoreNum++;
//	console.log(scoreNum)
	var scoreNumStr=scoreNum+"";
//	console.log(scoreNumStr)
	scoreBoard.innerHTML="";
	for (var i=0;i<scoreNumStr.length;i++) {
		var img=document.createElement("img");
		img.src=`img/${scoreNumStr[i]}.jpg`
		scoreBoard.appendChild(img)
		///scoreBoard.innerHTML=`<img src="img/${scoreNumStr[i]}.jpg"/>`
	}

	
}
function crash(a,b){
		return !(a.parentNode.offsetLeft>b.offsetLeft+b.offsetWidth||b.offsetLeft>a.parentNode.offsetLeft+a.offsetWidth||a.offsetTop>b.offsetTop+b.offsetHeight||b.offsetTop>a.offsetTop+a.offsetHeight)
	}
function gameOver(){
	console.log("游戏结束")
	clearInterval(downTimer);
	clearInterval(upTimer);
	clearInterval(pipeTimer);
	clearInterval(crashTimer);
	//关闭所有音乐
	audios[1].pause();
	audios[2].play();
	var lis=document.getElementsByTagName("li");
	for(var i=0;i<lis.length;i++){
		clearInterval(lis[i].moveTimer)
	}
	box.onclick=null;
	
}
function createPipe(){
	//出现管道
	var li=document.createElement("li");
	var topHeight=random(70,230);
	var bottomHeight=300-topHeight;
	li.innerHTML=`<div class="pipeTop" style="height:${topHeight}px">
						<img src="img/up_pipe.png"/>
					</div>
					<div class="pipeBottom" style="height:${bottomHeight}px">
						<img src="img/down_pipe.png"/>
					</div>`;
	li.lock=false;
		ul.appendChild(li);

	var pipeTop=document.getElementsByClassName("pipeTop")[0];
	var pipeBottom=document.getElementsByClassName("pipeBottom")[0];
	
	li.moveTimer=setInterval(
		function(){
//			li.style.left=li.offsetLeft-3+"px";
			li.style.left=`${li.offsetLeft-3}px`;
			
//			判断是否移出去,如果移出去了,那么删除之
			if(li.offsetLeft<-70){
				ul.removeChild(li)
			}
			//判断是否加分
			if(flyBird.offsetLeft>li.offsetLeft+li.offsetWidth&&li.lock==false){
				addScore();
				li.lock=true;
			}
			//碰撞检测
			
			
			if (crash(pipeTop,flyBird)||crash(pipeBottom,flyBird)) {
				gameOver()
			}
		},30
	)
}

function gameStart() {
	//head的那个牌子没有了
	//start按钮没有了、
	start.style.display = "none";
	title.style.display = "none";
	//播放音乐
	audios[1].play();
	//出现一只鸟
	flyBird.style.display = "block";
	downTimer = setInterval(function() {
		downBird()
	}, 30);
	pipeTimer=setInterval(createPipe,3000)//每三秒生成一个管道
	crashTimer=setInterval(function(){
	if(flyBird.offsetTop<=0||flyBird.offsetTop+flyBird.offsetHeight>=422){
		gameOver()
	}
},30)
}
start.onclick = function(event) {
	//取消事件冒泡
	var ev = event || window.event;
	if(ev.stopPropagation) {
		ev.stopPropagation()
	} else {
		ev.cancelBubble = true
	}
	gameStart();
	box.onclick = function() {
		//停止小鸟下降
		clearInterval(downTimer);
		clearInterval(upTimer);
		//播放音乐
		audios[0].pause();
		audios[0].play();
		flyBird.src = "img/up_bird1.png";
		speed = maxSpeed; //把8赋值给speed，初始上升速度快，但这个速度是逐减的
		upTimer = setInterval(function() {
			speed -= .7;
			if(speed <= 0) {
				//受到重力作用,当速度小于等于0的时候,小鸟将停止上升
				clearInterval(upTimer); //停止上升
//				重新开始下降
				downTimer = setInterval(function() {
					downBird()
				}, 30)
			}
			flyBird.style.top = flyBird.offsetTop - speed + "px";

		}, 30)
	}
}