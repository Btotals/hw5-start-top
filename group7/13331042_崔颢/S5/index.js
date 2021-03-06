// Generated by LiveScript 1.3.1
(function(){
  var Handler, Bubble, Reset, Robot, initBigBubble, initAllSmallCirlces, initResetButton, initRobot, initAHandler, initBHandler, initCHandler, initDHandler, initEHandler;
  Handler = (function(){
    Handler.displayName = 'Handler';
    var prototype = Handler.prototype, constructor = Handler;
    Handler.failRate = 0.4;
    Handler.messageBox = $('#message');
    Handler.allCircles = [];
    Handler.callBack = function(){
      return null;
    };
    Handler.setCallBack = function(temCallBack){
      this.callBack = temCallBack;
    };
    Handler.disableOtherCircles = function(nowCircle){
      var i$, ref$, len$, circle;
      for (i$ = 0, len$ = (ref$ = this.allCircles).length; i$ < len$; ++i$) {
        circle = ref$[i$];
        if (circle !== nowCircle && circle.status !== 'finished') {
          circle.status = 'unclickable';
          circle.theCircle.removeClass('clickable');
        }
      }
    };
    Handler.enableOtherCircles = function(nowCircle){
      var i$, ref$, len$, circle;
      for (i$ = 0, len$ = (ref$ = this.allCircles).length; i$ < len$; ++i$) {
        circle = ref$[i$];
        if (circle !== nowCircle && circle.status !== 'finished') {
          circle.theCircle.addClass('clickable');
          circle.status = 'clickable';
        }
      }
    };
    Handler.checkIfAllFinished = function(){
      var i$, ref$, len$, circle;
      for (i$ = 0, len$ = (ref$ = this.allCircles).length; i$ < len$; ++i$) {
        circle = ref$[i$];
        if (circle.status !== 'finished') {
          return false;
        }
      }
      return true;
    };
    function Handler(theCircle, bubble, successMessage, failMessage, randomCallBack){
      var this$ = this;
      this.theCircle = theCircle;
      this.bubble = bubble;
      this.successMessage = successMessage;
      this.failMessage = failMessage;
      this.randomCallBack = randomCallBack;
      this.status = "clickable";
      this.theCircle.addClass('clickable');
      this.constructor.allCircles.push(this);
      this.theCircle.click(function(){
        if (this$.status === 'clickable') {
          this$.constructor.disableOtherCircles(this$);
          this$.status = 'acquiring';
          this$.theCircle.append('<span class="unread" style="font-size:5px">..</span>');
          this$.getNumber();
        }
      });
    }
    prototype.getNumber = function(){
      var this$ = this;
      $.get('/', function(num, state){
        if (this$.status === 'acquiring') {
          this$.theCircle.find('.unread').text(num);
          this$.status = 'finished';
          this$.theCircle.removeClass('clickable');
          this$.constructor.enableOtherCircles(this$);
          if (this$.constructor.checkIfAllFinished()) {
            this$.bubble.setClickable();
          }
          this$.randomError(num);
          this$.constructor.callBack();
        }
      });
    };
    prototype.randomError = function(num){
      var flag;
      flag = Math.random() > this.constructor.failRate;
      if (flag) {
        $(this.constructor.messageBox).text(this.successMessage);
      }
      if (Robot.isWorking) {
        this.randomCallBack(flag, num);
      }
    };
    prototype.reset = function(){
      var init;
      this.constructor.messageBox.text('');
      this.status = 'clickable';
      this.theCircle.addClass('clickable');
      init = this.theCircle.text()[0];
      this.theCircle.text(init);
    };
    return Handler;
  }());
  Bubble = (function(){
    Bubble.displayName = 'Bubble';
    var prototype = Bubble.prototype, constructor = Bubble;
    Bubble.messageBox = $('#message');
    function Bubble(theBubble){
      var this$ = this;
      this.theBubble = theBubble;
      this.status = 'unclickable';
      this.theBubble.removeClass('clickable');
      this.theBubble.click(function(){
        if (this$.status === 'clickable') {
          this$.sumAllAndShow();
        }
      });
    }
    prototype.setClickable = function(){
      this.status = 'clickable';
      this.theBubble.addClass('clickable');
    };
    prototype.sumAllAndShow = function(){
      var sum, i$, ref$, len$, circle, tem;
      sum = 0;
      for (i$ = 0, len$ = (ref$ = Handler.allCircles).length; i$ < len$; ++i$) {
        circle = ref$[i$];
        tem = circle.theCircle.find('.unread').text();
        sum += parseInt(tem);
      }
      this.theBubble.html(this.theBubble.text() + '</br>' + sum);
      this.constructor.messageBox.text("楼主异步调用战斗力惊人，目测不超过" + sum);
      this.status = 'unclickable';
      this.theBubble.removeClass('clickable');
    };
    prototype.reset = function(){
      this.status = 'unclickable';
      this.theBubble.removeClass('clickable');
      this.theBubble.text('');
    };
    return Bubble;
  }());
  Reset = (function(){
    Reset.displayName = 'Reset';
    var prototype = Reset.prototype, constructor = Reset;
    function Reset(theReset, bubble){
      var this$ = this;
      this.theReset = theReset;
      this.bubble = bubble;
      this.theReset.mouseleave(function(){
        var i$, ref$, len$, circle;
        for (i$ = 0, len$ = (ref$ = Handler.allCircles).length; i$ < len$; ++i$) {
          circle = ref$[i$];
          circle.reset();
        }
        this$.bubble.reset();
        Robot.reset();
        Handler.callBack = function(){
          return null;
        };
      });
    }
    return Reset;
  }());
  Robot = (function(){
    Robot.displayName = 'Robot';
    var prototype = Robot.prototype, constructor = Robot;
    Robot.nowNum = -1;
    Robot.isWorking = false;
    Robot.seq = ["A", "B", "C", "D", "E"];
    Robot.getSequence = function(){
      this.seq.sort(function(){
        return 0.5 - Math.random();
      });
    };
    Robot.reset = function(){
      this.nowNum = 0;
      return this.isWorking = false;
    };
    Robot.getNext = function(){
      var i$, ref$, len$, now;
      for (i$ = 0, len$ = (ref$ = this.seq).length; i$ < len$; ++i$) {
        now = ref$[i$];
        if (Handler.allCircles[now.charCodeAt() - 'A'.charCodeAt()].status === 'finished') {
          continue;
        } else {
          break;
        }
      }
      this.nowNum = now.charCodeAt() - 'A'.charCodeAt();
    };
    prototype.start = function(){
      var callBack;
      if (this.constructor.isWorking) {
        if (Handler.checkIfAllFinished() === false) {
          this.constructor.getSequence();
          $('#info-bar').text(this.constructor.seq.join('、'));
          callBack = function(){
            if (Handler.checkIfAllFinished()) {
              Robot.bubble.click();
              Robot.isWorking = false;
            } else {
              Robot.getNext();
              Robot.circles[Robot.nowNum].click();
            }
          };
          Handler.setCallBack(callBack);
          this.constructor.getNext();
          this.constructor.circles[this.constructor.nowNum].click();
        }
      }
    };
    function Robot(){}
    return Robot;
  }());
  initBigBubble = function(){
    var bubble, bubbleHandler;
    bubble = $('#info-bar');
    bubbleHandler = new Bubble($(bubble));
    return bubbleHandler;
  };
  initAllSmallCirlces = function(bubble){
    initAHandler(bubble);
    initBHandler(bubble);
    initCHandler(bubble);
    initDHandler(bubble);
    initEHandler(bubble);
  };
  initResetButton = function(bubble){
    var reset, resetHandler;
    reset = $('#bottom-positioner');
    resetHandler = new Reset($(reset), bubble);
  };
  initRobot = function(bubble){
    var robot;
    Robot.circles = $('#control-ring .button');
    Robot.bubble = $('#info-bar');
    robot = new Robot(bubble);
    return robot;
  };
  initAHandler = function(bubble){
    var circles, aDom, successMassage, failMessage, aButton;
    circles = $('#control-ring .button');
    aDom = circles[0];
    successMassage = '这是个天大的秘密';
    failMessage = '这不是秘密';
    return aButton = new Handler($(aDom), bubble, successMassage, failMessage, function(success, number){
      if (success) {
        console.log("A succeeds!");
      } else {
        console.log("A meets an error, with message: " + failMessage);
      }
    });
  };
  initBHandler = function(bubble){
    var circles, bDom, successMassage, failMessage, bButton;
    circles = $('#control-ring .button');
    bDom = circles[1];
    successMassage = '我不知道';
    failMessage = '我知道';
    return bButton = new Handler($(bDom), bubble, successMassage, failMessage, function(success, number){
      if (success) {
        console.log("B succeeds!");
      } else {
        console.log("B meets an error, with message: " + failMessage);
      }
    });
  };
  initCHandler = function(bubble){
    var circles, cDom, successMassage, failMessage, cButton;
    circles = $('#control-ring .button');
    cDom = circles[2];
    successMassage = '你不知道';
    failMessage = '你知道';
    return cButton = new Handler($(cDom), bubble, successMassage, failMessage, function(success, number){
      if (success) {
        console.log("C succeeds!");
      } else {
        console.log("C meets an error, with message: " + failMessage);
      }
    });
  };
  initDHandler = function(bubble){
    var circles, dDom, successMassage, failMessage, dButton;
    circles = $('#control-ring .button');
    dDom = circles[3];
    successMassage = '他不知道';
    failMessage = '他知道';
    return dButton = new Handler($(dDom), bubble, successMassage, failMessage, function(success, number){
      if (success) {
        console.log("D succeeds!");
      } else {
        console.log("D meets an error, with message: " + failMessage);
      }
    });
  };
  initEHandler = function(bubble){
    var circles, eDom, successMassage, failMessage, eButton;
    circles = $('#control-ring .button');
    eDom = circles[4];
    successMassage = '才怪';
    failMessage = '就对了';
    return eButton = new Handler($(eDom), bubble, successMassage, failMessage, function(success, number){
      if (success) {
        console.log("E succeeds!");
      } else {
        console.log("E meets an error, with message: " + failMessage);
      }
    });
  };
  $(function(){
    var bubble, robot;
    bubble = initBigBubble();
    initAllSmallCirlces(bubble);
    initResetButton(bubble);
    robot = initRobot(bubble);
    return $('#button .apb').click(function(){
      if (Robot.isWorking === false) {
        Robot.isWorking = true;
        robot.start();
      }
    });
  });
}).call(this);
