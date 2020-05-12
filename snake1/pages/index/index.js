//1鼠标的行为
//1.1手指按下的坐标
var startX = 0;
var startY = 0;
//1.2手指在canvas上移动的坐标
var moveX = 0;
var moveY = 0;
//1.3移动位置跟开始位置的差值 初始化
var X = 0;
var Y = 0;
//蛇头的坐标 以对象形式设置坐标 绘制4 只能接受十六进制颜色设置
var snakeHead = {
    x:0,
    y:0,
    color:"#ff0000",
    w:20,
    h:20
};
//蛇身体对象（数组）
var snakeBodys=[];
//食物对象（数组）
var foods = [];
//窗口的宽高
var windowWidth=0;
var windowHeight=0;
//蛇身碰撞食物对象后，用于确定是否删除即snakeBodys.shift()执行删除功能
var collideBol=true;
//2蛇头动2.1 方向设置变量
var direction = null;//鼠标移动方向1
var snakeDirection = "right";//4.2蛇头移动方向变量初始值right //鼠标移动方向3
Page({
    canvasStart:function(e){
      //1.4
     startX = e.touches[0].x;
     startY = e.touches[0].y;
    },
    canvasMove:function(e){
             //1.5
             moveX = e.touches[0].x;
             moveY = e.touches[0].y;
             //1.6差值
             X= moveX - startX;
             Y= moveY - startY;
             //1.7控制移动的方向
               //判断哪个大?参<-左右-> 米
             if(Math.abs(X)>Math.abs(Y) && X>0){
                  //2蛇头动2.2 判断后,方向用变量存起来
                  direction = "right";//鼠标移动方向2
             }else if(Math.abs(X)>Math.abs(Y) && X<0){
                  direction ="left";
             }else if(Math.abs(Y)>Math.abs(X) && Y>0){
                  direction ="bottom";
             }else if(Math.abs(Y)>Math.abs(X) && Y<0){
                  direction ="top";
             }
     },
      //4鼠标的行为和蛇头4.1 //鼠标移动方向4
       canvasEnd:function(){
             snakeDirection = direction;//4.3鼠标滑动抬起时direction赋值给snakeDirection
       },
      //3蛇头 和控制移动的方向
      onReady:function(){
            //3.1获取画布的上下文
            var context = wx.createContext();
            //帧数
            var frameNum = 0;
            //蛇头绘制 蛇身绘制 食物绘制 统一封装为draw封装函数,方便重复调用，5行变1行。
            function draw(obj){
                    context.setFillStyle(obj.color);//蛇头填充颜色
                    context.beginPath();//开启路径
                    context.rect(obj.x,obj.y,obj.w,obj.h);// 坐标
                    context.closePath();//关闭路径
                    context.fill();//填充
             }
             //碰撞函数
             function collide(obj1,obj2){
                    var l1=obj1.x;
                    var r1=l1+obj1.w;
                    var t1=obj1.y;
                    var b1=t1+obj1.h;

                    var l2=obj2.x;
                    var r2=l2+obj2.w;
                    var t2=obj2.y;
                    var b2=t2+obj2.h;
                    if(r1>l2&&l1<r2&&b1>t2&&t1<b2){
                          return true;//碰撞collide返回true
                    }else{
                          return false;//没有碰撞collide返回false
                    }
             }
             //3.2绘制函数
            function animate(){ 
                    frameNum++;

                    if(frameNum % 60 == 0){
                          //每次移动时向蛇身体添加一个蛇头上一个的位置（蛇身体对象）
                          snakeBodys.push({
                                x:snakeHead.x,
                                y:snakeHead.y,
                                w:20, 
                                h:20, 
                                color:"#00ff00"
                          }) ;

                          if(snakeBodys.length>4){//默认4节蛇身体
                                if(collideBol){
                                       //移除多余最老的身体位置 从最老的蛇身体位置开始删除
                                      snakeBodys.shift();
                                }else{
                                      collideBol=true;//碰撞后collide返回true且给collideBol=false赋值后只停留一次没有shift()代码。接着就要赋值true给collideBol，就能继续snakeBodys.shift()了。
                                }
                          }

                          switch(snakeDirection){ //鼠标移动方向5
                               case "left":
                                   snakeHead.x -=snakeHead.w;
                                   break;
                               case "right":
                                   snakeHead.x +=snakeHead.w;
                                   break;
                               case "top":
                                    snakeHead.y -=snakeHead.h;
                                    break;
                               case "bottom":
                                    snakeHead.y +=snakeHead.h;
                                    break;
                          }//switch结束 

                          //蛇身绘制
                          for(var i=0;i<snakeBodys.length;i++){
                                var snakeBody =snakeBodys[i];
                                draw(snakeBody);
                          }

                          //蛇头绘制第1步：使用draw封装函数 【必须 蛇身代码 在 蛇头代码 前 push才不会覆盖蛇头】
                          draw(snakeHead);
                          
                          //食物绘制
                          for(var i=0;i<foods.length;i++){
                                var foodObj=foods[i];
                                draw(foodObj);
                                if(collide(snakeHead,foodObj)){
                                      console.log("撞上了");
                                      collideBol=false;
                                      foodObj.reset();//自己写的 调用reset(重置食物的位置和颜色的方法/函数)
                                 }     
                          }
                          //蛇头/蛇身/食物绘制第2步：绘制画布:画布标识canvasId，actions由 wx.createContext 创建的 context，调用 getActions 方法导出绘图动作数组。
                          wx.drawCanvas({
                                canvasId:"snakeCanvas",
                                actions:context.getActions()
                          });
                    }// frameNum % 20结束   
      
  
   
                   //requestAnimationFrame(animate);//请求动画API 总报错提示is not function 
                   //只得想办法自己来模拟,只需要写一段代码，来将渲染周期控制在 16 毫秒，就能够模拟出 requestAnimationFrame 这个 Api 所做的工作。。
                   var lastFrameTime = 0;
                   // 模拟 requestAnimationFrame
                   var doAnimationFrame = function (callback) {
                        var currTime = new Date().getTime();
                        var timeToCall = Math.max(0, 16 - (currTime - lastFrameTime));
                        var id = setTimeout(function () { callback(currTime + timeToCall); }, timeToCall);
                        lastFrameTime = currTime + timeToCall;
                        return id;
                    };
                    doAnimationFrame(animate);
            }//animate结束
             //随机小函数
             function rand(min,max){
                return parseInt(Math.random()*(max-min))+min;
             }
             //构造食物对象 构造函数
             function Food(){
                this.x=rand(0,windowWidth);
                this.y=rand(0,windowHeight);
                var w=rand(10,20);
                this.w=w;
                this.h=w;
                this.color="rgb("+rand(0,255)+","+rand(0,255)+","+rand(0,255)+")";
                //重置食物的位置和颜色
                this.reset=function(){
                   this.x=rand(0,windowWidth);
                   this.y=rand(0,windowHeight);
                   this.color="rgb("+rand(0,255)+","+rand(0,255)+","+rand(0,255)+")";
                }
             }
             wx.getSystemInfo({
                   success:function(res){
                          windowWidth=res.windowWidth;
                          windowHeight=res.windowHeight;
                                 //循环
                                for(var i=0;i<20;i++){
                                      var foodObj=new Food();//创建食物对象
                                      foods.push(foodObj);//存在食物数组里
                                }
                          //知道窗口宽高后才执行animate()
                          animate();//3.3绘制函数调用    
                   }//success结束
             })//wx.getSystemInfo结束
   
      }//onReady结束
})
