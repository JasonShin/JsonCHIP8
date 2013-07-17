/**
 * Created with JetBrains WebStorm.
 * User: JasonOwnzBiatch
 * Date: 29/06/13
 * Time: 1:26 PM
 * To change this template use File | Settings | File Templates.
 */
    var logCount = 0;
    function log(state, message){
       if(state && logCount < 1000){
           logCount ++;
           console.log(message);
       }
    }
