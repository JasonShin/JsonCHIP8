/**
 * Created with JetBrains WebStorm.
 * User: JasonOwnzBiatch
 * Date: 22/06/13
 * Time: 4:21 PM
 * To change this template use File | Settings | File Templates.
 */

var CPU = (function () {
    "use strict";
    var MEMORY_SIZE = 0xFFF,
        V_SIZE = 16,
        STACK_SIZE = 16,
        PROGRAM_START = 512;

    var logging = false;
    var memory = new Array(MEMORY_SIZE);

    var canvas,input,audio;

    var presets = {
        MEMORY_SIZE: 0xFFF,
        V_SIZE: 16,
        STACK_SIZE: 16,
        PROGRAM_START: 512
    };


    var registers = {

        V: new Array(presets.V_SIZE),
        //I: Used to store memory address
        I: 0,
        //Program counter: used to store currently executing address
        //program starts at 0x200
        PC: 0x200,
        //Stack pointer, It is used to point to the topmost level of the stack
        SP: 0,
        //Used to store the address that the interpreter should return to when finished with a subroutine
        stack: new Array(presets.STACK_SIZE),

        delayTimer: 0,
        soundTimer: 0

    };

    var CPU = function CPU(program, fontSet, c) {
        this.reset();
        loadProgram(program);
        loadFontSet(fontSet);
        input = new Input(document);
        audio = new MySound();
        canvas = c;
    };

    //PRIVATE:
    function loadProgram(program) {
        for (var i = 0; i < program.length; i++) {
            memory[presets.PROGRAM_START + i] = program[i];
        }
    }

    function loadFontSet(fontSet) {
        for (var i = 0; i < fontSet.length; i++) {
            memory[i] = fontSet[i];
        }
    }

    function getInstruction() {
        return memory[registers.PC] << 8 | memory[registers.PC + 1];
    }

    //PUBLIC:
    CPU.prototype.drawFlag = false;
    CPU.prototype.reset = function () {
        memory = new Array(presets.MEMORY_SIZE);
        registers.V = new Array(presets.V_SIZE);
        registers.I = 0;
        registers.PC = 0x200;
        registers.SP = 0;
        registers.stack = new Array(presets.STACK_SIZE);
        registers.delayTimer = 0;
        registers.soundTimer = 0;

        for (var i = 0; i < memory.length; i++){
            memory[i] = 0;
        }

        for (var i = 0; i < registers.V.length; i++){
            registers.V[i] = 0;
        }

        for (var i = 0; i < registers.stack.length; i++){
            registers.stack[i] = 0;
        }
    }


    CPU.prototype.decrementTime = function () {

        if (registers.delayTimer > 0) {
            //log(logging, "Decremented Delay timer");
            registers.delayTimer--;

        }

        if (registers.soundTimer > 0) {

            if (registers.soundTimer == 1){
                audio.playBeep();
            }
                //console.log("Soundtimer is at 1, beep!");

           // console.log("soundtimer is: " + registers.soundTimer);
            //log(logging, "Decremented sound timer");
           registers.soundTimer--;

        }
    }


    CPU.prototype.cycle = function () {
        var opcode = getInstruction();
        var vFirst = (opcode & 0xF000) >>> 12;
        var vX = (opcode & 0x0F00) >>> 8;
        var vY = (opcode & 0x00F0) >>> 4;
        var vN = (opcode & 0x000F);

        switch (vFirst) {
            case 0x0:
                var curCode = opcode & 0x00FF;
                switch (curCode) {
                    case 0x00E0:
                        log(logging, "0x00E0: Clear screen");
                        canvas.resetGraphics();
                        //clear screen code here
                        this.drawFlag = true;
                        break;
                    case 0x00EE:
                        log(logging, "0x00EE: Return from a subroutine");
                        registers.SP--;
                       //--registers.SP;
                        //registers.PC = registers.stack[registers.SP];

                        registers.PC = registers.stack.pop();


                        break;
                    default:
                        log(logging, "0xNNN: This instruction is skipped because it's only used for old machines " + (opcode & 0x0FFF));
                        break;
                }

                break;

            case 0x1:
                log(logging, "0x1nnn: Jump PC to location nnn");
                registers.PC = (opcode & 0x0FFF) - 2;
                log(logging, "0x1nnn: test: opcode: " + opcode + "   0x0FFF: " + (opcode & 0x0FFF));
                break;

            case 0x2:

                log(logging, "0x2nnn: Call subroutine at 2xnnn");


                registers.SP++;
                registers.stack.push(registers.PC);
                //registers.stack[registers.SP] = registers.PC;
                registers.PC = (opcode & 0x0FFF) - 2;
                break;

            case 0x3:

                log(logging, "0x3xnn: skip the next instruction if Vx = kk. " + " vX: " + registers.V[vX] + "  OP: " + (opcode & 0x00FF) + " raw " + (opcode & 0xF000 >> 8));

                if (registers.V[vX] === (opcode & 0x00FF)) {
                    registers.PC += 2;
                }

                break;

            case 0x4:
                log(logging, "0x4nn: Skip the next instruction if Vx != kk.")
                if (registers.V[vX] !== (opcode & 0x00FF))
                    registers.PC += 2;
                break;

            case 0x5:
                log(logging, "0x5xy0: Skip next instruction if Vx = Vy.");
                if (registers.V[vX] === registers.V[vY])
                    registers.PC += 2;
                break;

            case 0x6:
                log(logging, "0x6xkk: Setting Vx = kk.");
                registers.V[vX] = (opcode & 0x00FF);

                break;
            case 0x7:

                registers.V[vX] += (opcode & 0x00FF);
                log(logging, "0x7xkk: Setting Vx = Vx + kk.  V: " + registers.V[vX]);
                //registers.V[vX] %= 0xFF;
                if (registers.V[vX] > 255)
                  registers.V[vX] -= 256;
                //log(logging, "0x7xkk: current: " + registers.V[vX]);
                break;

            case 0x8:

                switch (vN) {
                    case 0x0:
                        log(logging, "0x8xy0: Set Vx = Vy.");
                        registers.V[vX] = registers.V[vY];

                        break;

                    case 0x1:
                        log(logging, "0x8xy1: Set Vx = Vx OR Vy");
                        registers.V[vX] = registers.V[vX] | registers.V[vY];
                        break;

                    case 0x2:
                        log(logging, "0x8xy2: Set Vx = Vx AND Vy");
                        registers.V[vX] = registers.V[vX] & registers.V[vY];
                        break;
                    case 0x3:
                        log(logging, "0x8xy3: Set Vx = Vx XOR Vy");
                        registers.V[vX] = registers.V[vX] ^ registers.V[vY];
                        break;

                    case 0x4:
                        log(logging, "0x8xy4: Set Vx = Vx + Vy, V[F] = carry");
                        //Only the lowest 8 bit will be saved to V[x]

                        var sum = registers.V[vX] + registers.V[vY];
                        if (sum > 255) {
                            registers.V[0xF] = 1;
                            registers.V[vX] -= 256;
                        } else {
                            registers.V[0xF] = 0;
                        }

                        registers.V[vX] = sum;

                        if (registers.V[vX] > 255) {
                         registers.V[vX] -= 256;
                         }
                        break;

                    case 0x5:
                        log(logging, "0x8xy5: If Vx > Vy, then VF is set to 1, otherwise 0. Then Vy is subtracted from Vx, and the results stored in Vx.");

                        //Only the lowest 8 bit will be saved to V[x]
                        if (registers.V[vX] > registers.V[vY])
                            registers.V[0xF] = 1;
                        else
                            registers.V[0xF] = 0;

                        registers.V[vX] = (registers.V[vX] - registers.V[vY]) & 0xFF;

                        // if (registers.V[vX] < 0)
                        //   registers.V[vX] += 256;

                        break;
                    case 0x6:
                        log(logging, "0x8xy6: If the least-significant bit of Vx is 1, then VF is set to 1, otherwise 0. Then Vx is divided by 2");


                        var lsb = registers.V[vX] & 0x1;
                        if (lsb) {
                            registers.V[0xF] = 1;
                        } else {
                            registers.V[0xF] = 0;
                        }
                        registers.V[vX] = registers.V[vX] >>> 1;

                        break;

                    case 0x7:
                        log(logging, "0x8xy7: Set Vx = Vy - Vx, set VF = NOT borrow");
                        //If Vy > Vx, then VF is set to 1, otherwise 0. Then Vx is subtracted from Vy, and the results stored in Vx.

                        if (registers.V[vY] > registers.V[vX])
                            registers.V[0xF] = 1;
                        else
                            registers.V[0xF] = 0;

                        registers.V[vX] = (registers.V[vX] - registers.V[vY]) & 0xFF;


                        break;

                    case 0xE:
                        log(logging, "0x8xyE: Set Vx = Vx SHL 1.");
                        //If the most-significant bit of Vx is 1, then VF is set to 1, otherwise to 0. Then Vx is multiplied by 2.

                        var lsb = registers.V[vX] >>> 0x7;

                        if(lsb){
                            registers.V[0xF] = 1;
                        } else{
                            registers.V[0xF] = 0;
                        }
                        registers.V[vX] = (registers.V[vX] << 1) & 0xFF;


                        break;
                }
                break;

            case 0x9:
                log(logging, "0x9xy0: Skip next instruction if Vx != Vy.");
                // The values of Vx and Vy are compared, and if they are not equal, the program counter is increased by 2.
                if (registers.V[vX] !== registers.V[vY])
                    registers.PC += 2;
                break;

            case 0xA:
                registers.I = (opcode & 0x0FFF);
                log(logging, "Annn: Set I = nnn.  I: " + registers.I);
                break;

            case 0xB:
                log(logging, "Bnnn: Jump to location nnn + V0.");
                //The program counter is set to nnn plus the value of V0.
                registers.PC = (opcode & 0x0FFF) + registers.V[0x0];
                break;
            case 0xC:
                log(logging, "Cxkk: Set Vx = random byte AND kk.");
                // The interpreter generates a random number from 0 to 255, which is then ANDed with the value kk.
                // The results are stored in Vx. See instruction 8xy2 for more information on AND.
                var randomNumber = Math.floor(Math.random() * 256);
                registers.V[vX] = randomNumber & (opcode & 0x00FF);
                break;

            case 0xD:
                log(logging, "Dxyn: Display n-byte sprite starting at memory location I at (Vx, Vy), set VF = collision.");
                //Draw flag become false once canvas has drawn pixels
                var x = registers.V[vX];
                var y = registers.V[vY];
                var height = opcode & 0x000F;
                var pixel;

                //console.log("Drawing pixel: x: " + x + "  y: " + y + "  height: " + height);
                registers.V[0xF] = 0;
                for (var row = 0; row < height; row++) {
                    //problem occurs here when playing TANK, pixel value sets to undefined.
                    pixel = memory[registers.I + row];
                    //console.log("row: " + row + "  I: " + registers.I);
                    // console.log(pixel);
                    canvas.displayMemory(pixel);
                    for (var col = 0; col < 8; col++) {


                        if ((pixel & (0x80 >> col)) !== 0) {
                            //console.log("row: " + row + "  col: " + col + "  x: " + x + "  y: " + y + "  CAN: " + canvas.graphics[20][63]);
                            var xCol = x + col;
                            var yRow = y + row;
                            if (xCol >= 0 && xCol < 64 && yRow >= 0 && yRow < 32) {
                                if (canvas.graphics[yRow][xCol] == 1)
                                    registers.V[0xF] = 1;

                                canvas.graphics[y + row][x + col] ^= 1;
                            }
                        }
                    }

                }

                this.drawFlag = true;

                break;

            case 0xE:
                var _0x00FF = opcode & 0x00FF;
                switch (_0x00FF) {
                    case 0x009E:
                        log(logging, "Ex9E: Skip next instruction if key with the value of Vx is pressed.");
                        //Checks the keyboard, and if the key corresponding to the value of Vx is currently in the down position, PC is increased by 2.
                        //console.log(input);
                        if (input.keys[registers.V[vX]])
                            registers.PC += 2;

                        break;
                    case 0x00A1:
                        log(logging, "ExA1: Skip next instruction if key with the value of Vx is not pressed.");
                        //Checks the keyboard, and if the key corresponding to the value of Vx is currently in the up position, PC is increased by 2.

                        if (!input.keys[registers.V[vX]])
                            registers.PC += 2;

                        break;
                }
                break;

            case 0xF:
                var _0x00FF = opcode & 0x00FF;
                switch (_0x00FF) {
                    case 0x0007:
                        log(logging, "Fx07: Set Vx = delay timer value.");
                        //The value of DT is placed into Vx.
                        registers.V[vX] = registers.delayTimer;

                        if(registers.V[vX] > 255){
                            registers.V[vX] -= 256;
                        }

                        break;

                    case 0x000A:
                        log(logging, "Fx0A: Wait for a key press, store the value of the key in Vx.");
                        //All execution stops until a key is pressed, then the value of that key is stored in Vx.
                        var keyPress = false;
                        for (var i = 0; i < input.keys.length; i++) {

                            if (input.keys[i] != 0) {
                                registers.V[vX] = i;
                                keyPress = true;
                            }
                        }


                        if(registers.V[vX] > 255){
                            registers.V[vX] -= 256;
                        }

                        //dirty way to do skipping process
                        registers.PC -= 2;

                        if (!keyPress)
                            return;

                        registers.PC += 2;

                        break;

                    case 0x0015:
                        log(logging, "Fx15: Set delay timer = Vx.");
                        //DT is set equal to the value of Vx.
                        registers.delayTimer = registers.V[vX];
                        break;


                    case 0x0018:
                        log(logging, "Fx18: Set sound timer = Vx.");
                        //ST is set equal to the value of Vx.
                        registers.soundTimer = registers.V[vX];
                        break;

                    case 0x001E:
                        // VF is set to 1 when range overflow (I+VX>0xFFF), and 0 when there isn't.
                       if ((registers.I + registers.V[vX]) > 0xFFF)
                            registers.V[0xF] = 1;
                        else
                            registers.V[0xF] = 0;

                        registers.I = (registers.I + registers.V[vX]) & 0xFFF;
                        log(logging, "Fx1E: Set I = I + Vx.   I: " + registers.I);
                        break;

                    case 0x0029:
                        //The value of I is set to the location for the hexadecimal sprite corresponding to the value of Vx.
                        // See section 2.4, Display, for more information on the Chip-8 hexadecimal font.
                        registers.I = Math.round(registers.V[vX] * 0x5);
                        log(logging, "Fx29: Set I = location of sprite for digit Vx.   I: " + registers.I);
                        break;

                    case 0x0033:
                        log(logging, "Fx33: Store BCD representation of Vx in memory locations I, I+1, and I+2.");
                        var _VX = registers.V[vX];
                        var _I = registers.I;
                        /*memory[_I] = (_VX / 100) | 0;
                         memory[_I + 1] = ((_VX / 10) % 10)  | 0;
                         memory[_I + 2] = ((_VX % 100) % 10)  | 0;*/
                        memory[_I] = (_VX / 100) | 0;
                        memory[_I + 1] = ((_VX - memory[_I] * 100) / 10) | 0;
                        memory[_I + 2] = (_VX - memory[_I] * 100 - memory[_I + 1] * 10) | 0;
                        break;

                    case 0x0055:
                        log(logging, "Fx55: Store registers V0 through Vx in memory starting at location I.");
                        for (var i = 0; i <= vX; i++) {
                            memory[registers.I + i] = registers.V[i];
                        }
                        //registers.I += vX + 1;
                        break;

                    case 0x0065:
                        log(logging, "Fx65: Read registers V0 through Vx from memory starting at location I.");
                        for (var i = 0; i < vX; i++)
                            registers.V[i] = memory[registers.I + i];

                        //registers.I += vX + 1;
                        break;

                }
                break;
            default:
                log(logging, "Unknown opcode!: " + opcode);
        }
        registers.PC += 2;
        //log(logging, "Current PC: " + registers.PC);
    };

    CPU.prototype.getLogging = function getLogging(){
        return logging;
    };

    CPU.prototype.getLogging = function setLogging(log){
        logging = log;
    };


    return CPU;


})();


function convertToBinary(dec) {
    var bits = [];
    var dividend = dec;
    var remainder = 0;
    while (dividend >= 2) {
        remainder = dividend % 2;
        bits.push(remainder);
        dividend = (dividend - remainder) / 2;
    }

    bits.push(dividend);
    bits.reverse();
    return bits.join("");
}