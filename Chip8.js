var CHIP_8 = (function () {
    "use strict"
    var inputSource = document;
    var CANVAS_NAME = "MainCanvas";
    var cpu, canvas, input;
    var gameInterval, renderInterval;

    var font_set = [
        0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
        0x20, 0x60, 0x20, 0x20, 0x70, // 1
        0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
        0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
        0x90, 0x90, 0xF0, 0x10, 0x10, // 4
        0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
        0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
        0xF0, 0x10, 0x20, 0x40, 0x40, // 7
        0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
        0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
        0xF0, 0x90, 0xF0, 0x90, 0x90, // A
        0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
        0xF0, 0x80, 0x80, 0x80, 0xF0, // C
        0xE0, 0x90, 0x90, 0x90, 0xE0, // D
        0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
        0xF0, 0x80, 0xF0, 0x80, 0x80  // F
    ];


    function CHIP_8() {}

    function run() {
        for(var i = 0; i < 3; i++){
            cpu.cycle();
            cpu.decrementTime();
        }
    }

    function render(){
        if(cpu.drawFlag){
            canvas.renderOnCanvas();
            cpu.drawFlag = false;
        }
    }

    CHIP_8.prototype.emulateCycle = function emulateCycle() {
        if(gameInterval == undefined && renderInterval == undefined){
            gameInterval = setInterval(run, 5);
            renderInterval = setInterval(render, 16);
        }
    }


    CHIP_8.prototype.start = function start(name) {
        this.reset();
        var xhr = new XMLHttpRequest();
        var chip8;
        xhr.open("GET", "programs/"+name, true);
        xhr.responseType = "arraybuffer";
        var scope = this;
        xhr.onload = function () {
            var program = new Uint8Array(xhr.response);
            canvas = new Canvas(CANVAS_NAME);
            cpu = new CPU(program, font_set, canvas);
            scope.emulateCycle();
        };
        xhr.send();
    }

    CHIP_8.prototype.reset = function reset(){
        //RESETING CHIP8 ATTRIBUTES
        this.stopLoop();
        cpu = undefined;
        canvas = undefined;
        input = undefined;
    }

    CHIP_8.prototype.stopLoop = function stopLoop(){
        if(gameInterval != undefined && renderInterval != undefined){
            clearInterval(gameInterval);
            clearInterval(renderInterval);
            gameInterval = undefined;
            renderInterval = undefined;
        }
    }

    return CHIP_8;
})();