/**
 * Created with JetBrains WebStorm.
 * User: JasonOwnzBiatch
 * Date: 7/07/13
 * Time: 6:20 PM
 * To change this template use File | Settings | File Templates.
 */

//MODULE IMPORTS
var Input = (function () {
    "use strict"
    //Constructor
    var Input = function (s) {
        source = s;
        //scope of the current input object
        var scope = this;

        reset.call(this);
        document.onkeydown = document.onkeyup = function (e) {
            handleKey.call(scope, e);
        };
    };

    //Public vars:
    Input.prototype.curKeyType = 1;
    Input.prototype.keys = new Array();

    //Private vars:
    var KEY_SIZE = 16;
    var source = undefined;

    var keyTypes = {
        NORMAL: 1
    };


    //Private:
    var reset = function reset() {
        this.keys = new Array(KEY_SIZE);
        for (var i = 0; i < KEY_SIZE; i++) {
            this.keys[i] = 0;
        }
    };
    //Public:
    function handleKey(evt) {
        var charCode = evt.which;
        var charStr = String.fromCharCode(charCode);

        var value = evt.type == 'keydown' ? 1 : 0;
        //console.log("test!!: " + value + "  keys " + this.keys);
        switch (charStr) {
            case '1':
                this.keys[0x1] = value;
                break;
            case '2':
                this.keys[0x2] = value;
                break;
            case '3':
                this.keys[0x3] = value;
                break;
            case '4':
                this.keys[0xC] = value;
                break;

            case 'Q':
                this.keys[0x4] = value;
                break;
            case 'W':
                this.keys[0x5] = value;
                break;
            case 'E':
                this.keys[0x6] = value;
                break;
            case 'R':
                this.keys[0xD] = value;
                break;

            case 'A':
                this.keys[0x7] = value;
                break;
            case 'S':
                this.keys[0x8] = value;
                break;
            case 'D':
                this.keys[0x9] = value;
                break;
            case 'F':
                this.keys[0xE] = value;
                break;

            case 'Z':
                this.keys[0xA] = value;
                break;
            case 'X':
                this.keys[0x0] = value;
                break;
            case 'C':
                this.keys[0xB] = value;
                break;
            case 'V':
                this.keys[0xF] = value;
                break;
            default:
            //console.log("crap key found");
        }
        //keyPressed = value ? value : keyPressed;
    };

    return Input;

})();
