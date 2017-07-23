(() => {
    const PI = Math.PI;

    let winW , winH;

    // bgCanvas
    (() => {
        const data = {
                bigerCircle : {
                    r: 10,
                    iNum: 12,
                    data: []
                },
                bigCircle : {
                    r: 7.5,
                    iNum: 12,
                    data: []
                },
                middleCircle : {
                    r: 6,
                    iNum: 6,
                    data: []
                },
                smallCircle : {
                    r: 5,
                    iNum: 6,
                    data: []
                },
                smallerCircle : {
                    r: 4,
                    iNum: 12,
                    data: []
                },
                smallestCircle : {
                    r: 2,
                    iNum: 18,
                    data: []
                }
            },
            oCanvas = document.getElementById('canvas'),
            ctx = oCanvas.getContext('2d');

        init();

        window.onresize = () => {
            setRange(oCanvas);
        };

        (function draw(){
            ctx.clearRect(0,0,winW,winH);
            for(let v of Object.values(data)){
                move(v);
            };
            window.requestAnimationFrame(draw);
        })();

        function produceCircle(d){
            for(let i = 0;i < d.iNum;i ++){
                d.data[i] = {
                    r: d.r,
                    x : Math.random() * winW,
                    y : Math.random() * winH,
                    xSpeed : Math.random() - .5,
                    ySpeed : Math.random() - .5
                };
                drawCircle(d.data[i]);
            };
        };

        function move(d){
            for(let i = 0;i < d.iNum;i ++){
                d.data[i].x += d.data[i].xSpeed;
                d.data[i].y += d.data[i].ySpeed;
                if(d.data[i].x <= 0 || d.data[i].x >= winW){
                    d.data[i].xSpeed = -d.data[i].xSpeed;
                };
                if(d.data[i].y <= 0 || d.data[i].y >= winH){
                    d.data[i].ySpeed = -d.data[i].ySpeed;
                };
                drawCircle(d.data[i]);
                check(d.data[i]);
            };
        };

        function init(){
            setRange(oCanvas);
            for(let v of Object.values(data)){
                produceCircle(v);
            };
        };

        function check(d){
            for(let v of Object.values(data)){
                checkDis(d , v.data);
            };
        };

        function checkDis(d , v){
            let l = v.length;
            for(let i = 0;i< l;i ++){
                let x = Math.pow(Math.abs(d.x - v[i].x) , 2),
                    y = Math.pow(Math.abs(d.y - v[i].y) , 2),
                    dis = Math.sqrt(x + y);
                if(dis < 50){
                    drawLine(d , v[i] , 'rgb(238 ,238 ,238)');
                }else if(dis < 100){
                    drawLine(d , v[i] , 'rgb(242 ,242 ,242)');
                }else if(dis < 150){
                    drawLine(d , v[i] , 'rgb(246 ,246 ,246)');
                };
            };
        };

        function drawLine(d , s , c){
            ctx.save();
            ctx.globalCompositeOperation = "destination-over";
            ctx.strokeStyle = c;
            ctx.beginPath();
            ctx.moveTo(s.x , s.y);
            ctx.lineTo(d.x , d.y);
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
        };

        function drawCircle(d){
            ctx.save();
            ctx.fillStyle = "rgb(212 ,212 ,212)";
            ctx.beginPath();
            ctx.arc(d.x , d.y , d.r , 0 , PI * 2, false);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        };
    })();

    //textCanvas
    (() => {
        const oCanvas = document.getElementById("text"),
            ctx = oCanvas.getContext('2d');

        (function drawFont(){
            ctx.save();
            const color = ctx.createLinearGradient(0 , 0 , 0 , oCanvas.height);
            color.addColorStop(0 , "rgba(150 , 150 , 150 , .5)");
            color.addColorStop(1 , "rgba(150 , 150 , 150 , 1)");
            ctx.fillStyle = color;
            ctx.font = "bold 40px Segoe Print";
            ctx.fillText("Merry" , 75 , 50);
            ctx.restore();
        })();
    })();

    // content
    (() => {
        const oContent = document.getElementById("content");

        /*
            x:     y:       res
            15deg   15deg   right-top
            15deg   -15deg  left-top
            -15deg  15deg   right-bottom
            -15deg  -15deg  left-bottom
        */

        oContent.onmouseenter = function(){
            let t = parseInt(getStyle(oContent,"top")),
                l = parseInt(getStyle(oContent,"left")),
                w = parseInt(getStyle(oContent,"width")),
                h = parseInt(getStyle(oContent,"height"));

            this.style.boxShadow = "rgba(0,0,0,.5) 0px 0px 100px";
            document.onmousemove = (e) => {
                e = e || widnow.event;
                let x = e.clientX - l + w / 2,
                    y = e.clientY - t,
                    X = x - w / 2,
                    Y = h / 2 - y;
                
                this.style.transform = `rotateX(${Y / 20}deg) rotateY(${X / 20}deg)`;
            };
            this.onmouseleave = function(){
                document.onmousemove = null;
                this.style.boxShadow = "rgba(0,0,0,.5) 0px 0px 0px";
                this.style.transform = "rotateX(0deg) rotateY(0deg)";
            };
        };
    })();

    function setRange(o){
        return (() => {
            let range = getRange();
            o.width = winW = range.width;
            o.height = winH = range.height;
        })();
    };

    function getRange(){
        return {
            width: document.body.clientWidth,
            height: document.body.clientHeight
        };
    };

    function getStyle(o , a){
        return o.currentStyle ? o.currentStyle[a] : getComputedStyle(o)[a];
    };

    window.requestAnimationFrame = (() => {
        return window.requestAnimationFrame ||
            window.oRequstAnimationFrame ||
            window.msRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            function(callback){
                window.setTimeout(callback , 1000 / 60);
            };
    })();
})();