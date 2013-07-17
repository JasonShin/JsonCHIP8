/**
 * Created with JetBrains WebStorm.
 * User: JasonOwnzBiatch
 * Date: 22/06/13
 * Time: 4:20 PM
 * To change this template use File | Settings | File Templates.
 */

var Canvas = (function(){
    "use strict"
    //ELEMENTS: FIRST = BLOCK, SECOND = EMPTY SPACE
    var colourSet = {
        aqua: [[160,192,240], [0,32,48]],
        grass: [[23,86,0], [150,239,12]],
        black: [[0,0,0], [255,255,255]],
        white: [[255,255,255], [0,0,0]]
    };

    var curColourSet = "aqua";

    var GFX_WIDTH = 64,
        GFX_HEIGHT = 32,
        MAGNIFICATION = 10,
        CANVAS_WIDTH = GFX_WIDTH * MAGNIFICATION,
        CANVAS_HEIGHT = GFX_HEIGHT * MAGNIFICATION,
        BLOCK_WIDTH = MAGNIFICATION,
        BLOCK_HEIGHT = MAGNIFICATION;

    var filledBlock = undefined,
        emptyBlock = undefined;

    var cur_canvas = undefined,
        cur_context = undefined;

    function Canvas(id){

        var canvas = document.getElementById(id);
        canvas.width = (CANVAS_WIDTH);
        canvas.height = (CANVAS_HEIGHT);
        //canvas.style.border = "1px solid black";
        cur_context = canvas.getContext("2d");
        cur_canvas = canvas;
        this.resetGraphics();
    };

    //Private:


    //Public:
    Canvas.prototype.graphics = new Array();
    Canvas.prototype.cacheGraphics = new Array();

    Canvas.prototype.resetGraphics = function resetGraphics(){
        cur_canvas.width = cur_canvas.width;
        this.graphics = new Array(GFX_HEIGHT);
        this.cacheGraphics = new Array(GFX_HEIGHT);
        for(var i = 0; i < this.graphics.length; i++){
            this.graphics[i] = new Array(GFX_WIDTH);
            this.cacheGraphics[i] = new Array(GFX_WIDTH);
        }

        for(var row = 0; row < this.graphics.length; row++){
            for(var col = 0; col < this.graphics[row].length; col++){
                this.graphics[row][col] = 0;
                this.cacheGraphics[row][col] = 3;
            }
        }
    }


    Canvas.prototype.renderOnCanvas = function(){

        for (var row = 0; row < this.graphics.length; row++) {
            for (var col = 0; col < this.graphics[row].length; col++) {
                if(this.graphics[row][col] != this.cacheGraphics[row][col]){
                    var colour = undefined;
                    var x, y;
                    x = col * MAGNIFICATION;
                    y = row * MAGNIFICATION;

                    if(this.graphics[row][col]){
                        colour = colourSet.aqua[0];
                    } else {
                        colour = colourSet.aqua[1];
                    }
                    cur_context.fillStyle = "rgb(" + colour[0] + "," + colour[1] + "," + colour[2] + ")";
                    cur_context.fillRect(x,y,BLOCK_WIDTH,BLOCK_HEIGHT);
                    this.cacheGraphics[row][col] = this.graphics[row][col];

                }

            }
        }


    };

    Canvas.prototype.displayMemory = function(num){
        var bin = num.toString(2);
        var binLength = bin.length;
        var pad = "";
        if(binLength < 8){
            var leftOver = 8 - binLength;

            for(var i = 0; i < leftOver; i++){
                pad += "0";
            }
        }
    };

    Canvas.prototype.displayText = function(){
        var div = document.getElementById("fills");

        //empty children nodes
        div.innerHTML = "";
        for (var row = 0; row < this.graphics.length; row++) {
            var str = "";
            for (var col = 0; col < this.graphics[row].length; col++) {
                str += "" + this.graphics[row][col];
            }
            var line = document.createElement("div");
            line.innerText = str;
            div.appendChild(line);
        }
    };

    Canvas.prototype.drawDummy = function(){
        var imgData = cur_context.createImageData(10, 10);
        for (var i=0;i<imgData.data.length;i+=4)
        {
            imgData.data[i+0]=255;
            imgData.data[i+1]=0;
            imgData.data[i+2]=0;
            imgData.data[i+3]=255;
        }
        cur_context.putImageData(imgData, 10, 10);
        cur_context.putImageData(imgData, 100, 10);
        /*cur_context.fillStyle = "rgb(200,0,0)";
        cur_context.fillRect(295,10,5,5);*/
    };
    return Canvas;
})();