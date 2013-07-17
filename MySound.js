/**
 * Created with JetBrains WebStorm.
 * User: JasonOwnzBiatch
 * Date: 16/07/13
 * Time: 12:06 PM
 * To change this template use File | Settings | File Templates.
 */
var MySound = (function () {
    "use strict"
    var beep1 = undefined;

    function MySound() {
        //beep1 = new Audio("Audio/beep.wav");

    }

    MySound.prototype.playBeep = function playBeep(){

        new Audio("Audio/beep.wav").play();
    }

    return MySound;

})();