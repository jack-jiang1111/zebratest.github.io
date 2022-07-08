var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CPrimalParse = (function () {
    function CPrimalParse(c) {
        this.m_commandsAfterP = [];
        this.m_backupLine = [];
        this.m_commandFunctions = [];
        this.m_errorPad = [];
        this.m_command = c;
        this.m_nullFlag = 0;
        this.m_IGCFlag = 0;
        this.m_sendFlag = 0;
    }
    CPrimalParse.prototype.divide = function () {
        var couterError = 0;
        var tempComm = [];
        if (this.m_command.search(' ') > -1)
            tempComm = this.m_command.split(' ');
        else
            tempComm[0] = this.m_command;
        var tempComm2 = tempComm.join('');
        if (tempComm2.search("if") > -1 ||
            tempComm2.search("while") > -1 ||
            tempComm2.search("break") > -1 ||
            tempComm2.search("cont") > -1 ||
            tempComm2.search("jmpi") > -1) {
            if (tempComm2.search("if") > -1)
                this.m_errorPad[couterError] = "if instruction- no regioning";
            if (tempComm2.search("while") > -1)
                this.m_errorPad[couterError] = "while instruction- no regioning";
            if (tempComm2.search("break") > -1)
                this.m_errorPad[couterError] = "break instruction- no regioning";
            if (tempComm2.search("cont") > -1)
                this.m_errorPad[couterError] = "cont instruction- no regioning";
            if (tempComm2.search("jmpi") > -1)
                this.m_errorPad[couterError] = "jmpi instruction- no regioning";
            couterError++;
            tempComm2 = "0";
            this.m_commandsAfterP[0] = tempComm2;
        }
        if (tempComm2.indexOf("//") == 0) {
            tempComm2 = "0";
            this.m_commandsAfterP[0] = tempComm2;
            this.m_errorPad[couterError] = "comment";
        }
        if (tempComm2.indexOf("(W") != -1 ||
            tempComm2.indexOf("}") != -1 ||
            tempComm2.indexOf("|M") != -1) {
            if (tempComm2.indexOf("(W") != -1 ||
                tempComm2.indexOf("|M") != -1) {
                tempComm2 = this.isDifferent("-r", tempComm2);
                tempComm2 = this.isDifferent("(abs)r", tempComm2);
                tempComm2 = this.isDifferent("-(abs)r", tempComm2);
                tempComm2 = this.isDifferent("(abs)-r", tempComm2);
                this.m_IGCFlag = 1;
                if (tempComm2.search('null') != -1)
                    this.m_nullFlag = 1;
                this.m_sigleInstrFlag = 0;
                this.m_type = 0;
                var tempPraseIGC = new CParseIGC(tempComm2);
                tempPraseIGC.divide();
                this.m_commandsAfterP = tempPraseIGC.getList();
                this.m_sendFlag = tempPraseIGC.getSendFlag();
            }
            else {
                tempComm2 = tempComm2.toLowerCase();
                if (tempComm2.search("send") > -1) {
                    this.whileSend(tempComm2);
                    this.m_sendFlag = 1;
                }
                if (tempComm2.search('math') > -1) {
                    if (tempComm2.search('null') > -1) {
                        var tempii = tempComm2.split('null');
                        if (tempii[1].indexOf(".") != 0) {
                            tempComm2 = tempii[0];
                            for (var i = 1; i < tempii.length; i++) {
                                tempComm2 = tempComm2 + tempii[i];
                            }
                        }
                    }
                }
                if (tempComm2.search("shr") > -1) {
                    var tempp = tempComm2.split("shr");
                    tempComm2 = tempp[0] + "SHR" + tempp[1];
                }
                if (tempComm2.search("or") > -1) {
                    var tempp = tempComm2.split("or");
                    tempComm2 = tempp[0] + "OR" + tempp[1];
                }
                if (tempComm2.search("{") > -1) {
                    this.m_sigleInstrFlag = 0;
                    var tempComm3 = tempComm2.split("{");
                    if (tempComm3[1].indexOf("align") != -1) {
                        var commRest = [];
                        var Commands = [];
                        if (tempComm3[1].indexOf("align16") != -1) {
                            if (tempComm3[0].search(";") > -1) {
                                this.m_errorPad[couterError] = "Wrong type: should be align1";
                                couterError++;
                                this.m_type = 0;
                            }
                            else
                                this.m_type = 1;
                        }
                        else if (tempComm3[1].indexOf("align1") != -1) {
                            if (this.ifParall(tempComm3[0]) == 1) {
                                this.m_errorPad[couterError] = "Wrong type: should be align16";
                                couterError++;
                                this.m_type = 1;
                            }
                            else
                                this.m_type = 0;
                        }
                        else {
                            this.m_errorPad[couterError] = "Unnown type or no coma in " + tempComm3[1];
                            couterError++;
                        }
                        tempComm3[0] = this.isNumber(tempComm3[0]);
                        if (tempComm3[0].search("null") > -1) {
                            var commTemp = tempComm3[0].split("null");
                            if (tempComm3[0].indexOf('null.') == -1) {
                                commTemp[1] = "r0.0<1>" + commTemp[1];
                            }
                            else {
                                commTemp[1] = "r0" + commTemp[1];
                            }
                            var tempComm4 = commTemp.join('');
                            if (this.m_type == 1) {
                                if (tempComm4.search(":") > -1) {
                                    var commTemp2 = tempComm4.split(":");
                                    commTemp2[1] = ".a:" + commTemp2[1];
                                    for (var w = 2; w < commTemp2.length; w++) {
                                        commTemp2[w] = ":" + commTemp2[w];
                                    }
                                    tempComm4 = commTemp2.join('');
                                }
                            }
                            tempComm3[0] = tempComm4;
                            this.m_nullFlag = 1;
                        }
                        if (tempComm3[0].search("0x") > -1) {
                            var commTemp = tempComm3[0].split("0x");
                            for (var i = 1; i < commTemp.length; i++) {
                                commTemp[i] = "r0x" + commTemp[i];
                            }
                            var tempComm4 = commTemp.join('');
                            tempComm3[0] = tempComm4;
                        }
                        if (tempComm3[0].search("r") > -1) {
                            tempComm3[0] = this.isDifferent("-r", tempComm3[0]);
                            tempComm3[0] = this.isDifferent("(abs)r", tempComm3[0]);
                            tempComm3[0] = this.isDifferent("-(abs)r", tempComm3[0]);
                            tempComm3[0] = this.isDifferent("(abs)-r", tempComm3[0]);
                            if (tempComm3[0].search('.r') > -1) {
                                var commands = tempComm3[0].split('.r');
                                var ccommtemporary = commands[0];
                                for (var i = 1; i < commands.length; i++) {
                                    ccommtemporary = ccommtemporary + '.x' + commands[i];
                                }
                                tempComm3[0] = ccommtemporary;
                            }
                            var commands = tempComm3[0].split("r");
                            if (commands[0].search('o') == 0) {
                                commands[0] = commands[0] + commands[1];
                                for (var i = 1; i < commands.length - 1; i++) {
                                    commands[i] = commands[i + 1];
                                }
                            }
                            var j = 0;
                            for (var i = 0; i < commands.length; i++) {
                                if (commands[i].search("0x") > -1) {
                                    j++;
                                }
                                else {
                                    Commands[i - j] = commands[i];
                                }
                            }
                            commRest = Commands;
                            var comLength = commRest.length;
                            for (var i = 0; i < comLength; i++) {
                                this.m_commandsAfterP[i] = Commands[i];
                            }
                        }
                    }
                    if (tempComm3[0].search("if") > -1) {
                        this.m_errorPad[couterError] = "if instruction- no regioning";
                        couterError++;
                        tempComm3[0] = "0";
                        this.m_commandsAfterP[0] = tempComm3[0];
                    }
                }
            }
        }
        else if (tempComm2.search('r') == 0
            || tempComm2.search('null') == 0) {
            if (tempComm2.search(">") > -1) {
                var tempComm3 = tempComm2.split(">");
                if (tempComm3[1].indexOf(".x") != -1 ||
                    tempComm3[1].indexOf(".y") != -1 ||
                    tempComm3[1].indexOf(".z") != -1 ||
                    tempComm3[1].indexOf(".w") != -1) {
                    this.m_sigleInstrFlag = 4;
                    if (tempComm2.indexOf('r') > -1) {
                        var command = tempComm2.split('r');
                        this.m_commandsAfterP[0] = command[1];
                    }
                }
                else {
                    if (tempComm3[0].search(";") > -1) {
                        this.m_sigleInstrFlag = 2;
                        if (tempComm2.indexOf('r') > -1) {
                            var command = tempComm2.split('r');
                            this.m_commandsAfterP[0] = command[1];
                        }
                    }
                    else {
                        this.m_sigleInstrFlag = 1;
                        if (tempComm2.indexOf('r') > -1) {
                            var command = tempComm2.split('r');
                            this.m_commandsAfterP[0] = command[1];
                        }
                    }
                }
            }
            else {
                this.m_sigleInstrFlag = 3;
                if (tempComm2.search('r') > -1) {
                    var command = tempComm2.split('r');
                    this.m_commandsAfterP[0] = command[1];
                }
            }
        }
        else {
            if (this.m_errorPad[0] == null) {
                this.m_errorPad[couterError] = 'You didn\'t write brackets {} in: ' + this.m_command;
                couterError++;
            }
            this.m_commandsAfterP[0] = "0";
        }
    };
    CPrimalParse.prototype.getHexadecimal = function () {
        return this.m_sendHexa;
    };
    CPrimalParse.prototype.isIGC = function () {
        return this.m_IGCFlag;
    };
    CPrimalParse.prototype.isSend = function () {
        return this.m_sendFlag;
    };
    CPrimalParse.prototype.getErrorList = function () {
        return this.m_errorPad;
    };
    CPrimalParse.prototype.isSerial = function () {
        return this.m_type;
    };
    CPrimalParse.prototype.returnCommandc = function () {
        return this.m_commandsAfterP;
    };
    CPrimalParse.prototype.returnNullFlag = function () {
        return this.m_nullFlag;
    };
    CPrimalParse.prototype.isSingle = function () {
        return this.m_sigleInstrFlag;
    };
    CPrimalParse.prototype.isDifferent = function (command, parseLine) {
        if (parseLine.search(command) > -1) {
            var commands = parseLine.split(command);
            var ccommtemporary = commands[0];
            for (var i = 1; i < commands.length; i++) {
                ccommtemporary = ccommtemporary + "r" + commands[i];
            }
            return ccommtemporary;
        }
        else
            return parseLine;
    };
    CPrimalParse.prototype.ifParall = function (command) {
        if (command.indexOf('.x') != -1 &&
            command.search('0x') < 0) {
            return 1;
        }
        else if (command.search('w') > -1 &&
            command.search('ww') > -1 &&
            command.search('xw') > -1 &&
            command.indexOf('.w') != -1 &&
            command.search('zw') > -1 &&
            command.search('yw') > -1) {
            return 1;
        }
        else if (command.search('y') > -1)
            return 1;
        else if (command.search('z') > -1 &&
            command.search('z.') < 0)
            return 1;
        else
            return 0;
    };
    CPrimalParse.prototype.whileSend = function (command) {
        if (command.indexOf("0x") != -1) {
            var temp = command.split("0x");
            this.m_sendHexa = "0x" + temp[1].toUpperCase() + "  0x";
            if (temp[2].indexOf(":") != -1) {
                this.m_sendHexa += temp[2].split(":")[0];
            }
            if (temp[2].indexOf("{") != -1) {
                this.m_sendHexa += temp[2].split("{")[0].toUpperCase();
            }
        }
    };
    CPrimalParse.prototype.isNumber = function (command) {
        if (command.indexOf(":") != -1) {
            var command2 = command.split(":");
            for (var i = 1; i < command2.length; i++) {
                if (command2[i].indexOf("u") == 0 ||
                    command2[i].indexOf("h") == 0 ||
                    command2[i].indexOf("df") == 0) {
                    for (var j = 0; j < 10; j++) {
                        if (command2[i].indexOf("" + j) == 2) {
                            var temp = command2[i].split("" + j);
                            command2[i] = temp[0] + j + "x" + temp[1];
                        }
                    }
                }
                else {
                    for (var j = 0; j < 10; j++) {
                        if (command2[i].indexOf("" + j) == 1) {
                            var temp = command2[i].split("" + j);
                            command2[i] = temp[0] + j + "x" + temp[1];
                        }
                    }
                }
            }
            var temp2 = command2[0];
            for (var k = 1; k < command2.length; k++) {
                temp2 += ":" + command2[k];
            }
            return temp2;
        }
        else
            return command;
    };
    return CPrimalParse;
})();
var CParseIGC = (function () {
    function CParseIGC(line) {
        this.m_list = [];
        this.m_flagFlag = [];
        this.m_command = line;
        this.m_nullFlag = 0;
        this.m_sendFlag = 0;
        this.m_flag = 0;
    }
    CParseIGC.prototype.divide = function () {
        this.m_commandWithoutComments = this.deleteComments();
        if (this.m_commandWithoutComments.search("f") != -1)
            this.searchForFlags();
        if (this.m_commandWithoutComments.search("send") > -1) {
            this.separeteHexadecimalNumbers();
            this.m_sendFlag = 1;
        }
        this.deleteCompacted();
        this.deleteUnusedNumbers();
        this.nullSelector();
        if (this.m_commandWithoutComments.search("r") != -1) {
            this.m_list = this.m_commandWithoutComments.split("r");
            this.getNullBack();
        }
    };
    CParseIGC.prototype.isFlag = function () {
        return this.m_flag;
    };
    CParseIGC.prototype.getSendFlag = function () {
        return this.m_sendFlag;
    };
    CParseIGC.prototype.getList = function () {
        return this.m_list;
    };
    CParseIGC.prototype.getHexadecimal = function () {
        return this.m_hexadecNumbers;
    };
    CParseIGC.prototype.deleteCompacted = function () {
        if (this.m_commandWithoutComments.indexOf("{") != -1) {
            var temp = this.m_commandWithoutComments.split("{");
            this.m_commandWithoutComments = temp[0];
        }
    };
    CParseIGC.prototype.getNullBack = function () {
        if (this.m_command.search('null') > -1) {
            if (('r' + this.m_list[1]).indexOf('r0') != -1) {
                var temp = ('r' + this.m_list[1]).split('r0');
                if (temp[1])
                    this.m_list[1] = temp[0] + 'null' + temp[1];
            }
        }
    };
    CParseIGC.prototype.deleteUnusedNumbers = function () {
        var temp = this.m_commandWithoutComments.split("r");
        if (temp[temp.length - 1].indexOf(":") != -1) {
            var temp2 = [];
            temp2[0] = " ";
            temp2 = temp[temp.length - 1].split(":");
            if (temp2[1]) {
                if (this.isNumber(temp2[1]) == 1) {
                    if (temp2[1].indexOf("-") > -1) {
                        var temp3 = temp2[1].split("-");
                        temp[temp.length - 1] = temp2[0] + ":" + temp3[0];
                    }
                    else {
                        var temp4 = temp2[1].split('');
                        temp[temp.length - 1] = temp2[0] + ":";
                        for (var i = 0; i < 2; i++) {
                            if (this.isNumber(temp4[i]) == 0)
                                temp[temp.length - 1] += temp4[i];
                        }
                    }
                }
            }
            this.m_commandWithoutComments = " ";
            for (var i = 0; i < temp.length - 1; i++)
                this.m_commandWithoutComments += temp[i] + "r";
            this.m_commandWithoutComments += temp[temp.length - 1];
        }
    };
    CParseIGC.prototype.isNumber = function (command) {
        if (command.indexOf("1") != -1 ||
            command.indexOf("2") != -1 ||
            command.indexOf("3") != -1 ||
            command.indexOf("4") != -1 ||
            command.indexOf("5") != -1 ||
            command.indexOf("6") != -1 ||
            command.indexOf("7") != -1 ||
            command.indexOf("8") != -1 ||
            command.indexOf("9") != -1 ||
            command.indexOf("0") != -1) {
            return 1;
        }
        else
            return 0;
    };
    CParseIGC.prototype.separeteHexadecimalNumbers = function () {
        if (this.m_commandWithoutComments.indexOf("x") != -1 &&
            this.m_commandWithoutComments.search("send") > -1) {
            var temp = this.m_commandWithoutComments.split("0x");
            if (temp[1]) {
                this.m_hexadecNumbers = "0x" + temp[1];
                if (temp[2])
                    this.m_hexadecNumbers += "0x" + temp[2];
            }
        }
        this.m_commandWithoutComments = temp[0];
    };
    CParseIGC.prototype.nullSelector = function () {
        if (this.m_commandWithoutComments.search('null') > -1) {
            var temp = this.m_commandWithoutComments.split("null");
            if (temp[0]) {
                if (temp[0].indexOf('f1') != -1 ||
                    temp[0].indexOf('f0') != -1) {
                    this.m_flag = 3;
                    if (temp[0].indexOf('rf') != -1) {
                        var tt = temp[0].split('rf');
                        if (tt[1])
                            temp[0] = tt[0] + "f" + tt[1];
                    }
                }
            }
            if (temp[1])
                this.m_commandWithoutComments = temp[0] + "r0" + temp[1];
            this.m_nullFlag = 1;
        }
    };
    CParseIGC.prototype.deleteComments = function () {
        if (this.m_command.indexOf("//") != -1) {
            var temp = this.m_command.split("//");
            return temp[0];
        }
        return this.m_command;
    };
    CParseIGC.prototype.searchForFlags = function () {
        if (this.m_commandWithoutComments.search("f0.0") != -1 ||
            this.m_commandWithoutComments.search("f0.1") != -1 ||
            this.m_commandWithoutComments.search("f1.0") != -1 ||
            this.m_commandWithoutComments.search("f1.1") != -1) {
            if (this.m_commandWithoutComments.search("f0.") != -1) {
                var temp = this.m_commandWithoutComments.split("f0.");
                var temp2;
                temp2 = "";
                for (var i = 0; i < temp.length - 1; i++) {
                    if (temp[i]) {
                        if (temp[i].indexOf('&') < 0)
                            temp2 += temp[i] + "rf0.";
                        else
                            temp2 += temp[i] + "f0.";
                    }
                }
                this.m_commandWithoutComments = temp2 + temp[temp.length - 1];
            }
            if (this.m_commandWithoutComments.search("f1.") != -1) {
                var tem = this.m_commandWithoutComments.split("f1.");
                var tem2;
                tem2 = "";
                for (var i = 0; i < tem.length - 1; i++) {
                    if (tem[i]) {
                        if (tem[i].indexOf('&') < 0)
                            tem2 += tem[i] + "rf1.";
                        else
                            tem2 += tem[i] + "f1.";
                    }
                }
                this.m_commandWithoutComments = tem2 + tem[tem.length - 1];
            }
        }
    };
    return CParseIGC;
})();
var CParseToGetSIMD = (function () {
    function CParseToGetSIMD(c) {
        this.m_flag = {};
        this.m_flagParalDest = {};
        this.m_flagParalD = [];
        this.m_errorPad = [];
        this.m_command = c;
        this.m_flag["0.0"] = 1;
        this.m_flag["0.1"] = 2;
        this.m_flag["1.0"] = 3;
        this.m_flag["1.1"] = 4;
        this.m_flagParalDest["x"] = 0;
        this.m_flagParalDest["y"] = 3;
        this.m_flagParalDest["z"] = 2;
        this.m_flagParalDest["w"] = 1;
        this.m_flagParal = 0;
        this.m_errorCounter = 0;
        this.m_stopFlag = 0;
    }
    CParseToGetSIMD.prototype.divide = function () {
        if (this.m_command.indexOf("(") != -1) {
            var tempC = this.m_command.split("(");
            this.m_Funct = tempC[0];
            if (tempC[1]) {
                if (tempC[1].indexOf(")") != -1) {
                    var tempCom = tempC[1].split(")");
                    this.m_AmountNum = parseInt((tempCom[0]), 10);
                }
            }
            else {
                this.m_errorPad[this.m_errorCounter] = "Something wrong with () brackets";
                this.m_errorCounter++;
                this.m_stopFlag = 1;
            }
        }
        else {
            this.m_errorPad[this.m_errorCounter] = "Something wrong with () brackets";
            this.m_errorCounter++;
            this.m_stopFlag = 1;
        }
    };
    CParseToGetSIMD.prototype.getErrorList = function () {
        return this.m_errorPad;
    };
    CParseToGetSIMD.prototype.getFunct = function () {
        return this.m_Funct;
    };
    CParseToGetSIMD.prototype.getFlag = function () {
        if (this.isWithFlag) {
            if (this.m_command.indexOf('(eq)f') != -1) {
                var tt = this.m_command.split('(eq)f');
                if (tt[1])
                    return this.m_flagRow = this.m_flag[tt[1]];
                this.m_flagParalD = [0, 1, 2, 3];
            }
            else if (this.m_Funct.indexOf('f') != -1) {
                var temp = this.m_Funct.split("f");
                var temp2 = temp[1].split('');
                if (temp2[1] == ".") {
                    this.m_flagRow = this.m_flag[temp2[0] + temp2[1] + temp2[2]];
                    for (var i = 0; i < temp.length; i++) {
                        if (temp[1].search('.x') > -1 ||
                            temp[1].search('.y') > -1 ||
                            temp[1].search('.z') > -1 ||
                            temp[1].search('.w') > -1) {
                            this.m_flagParal = 1;
                            var tempp = temp[1].split(".");
                            if (tempp[2].search('x') > -1 ||
                                tempp[2].search('y') > -1 ||
                                tempp[2].search('z') > -1 ||
                                tempp[2].search('y') > -1) {
                                var splitTemp = tempp[i + 1].split('');
                                for (var j = 0; j < 4; j++) {
                                    if (splitTemp[j] != 'x' &&
                                        splitTemp[j] != 'y' &&
                                        splitTemp[j] != 'z' &&
                                        splitTemp[j] != 'w') {
                                        j = 4;
                                    }
                                    this.m_flagParalD[j] = this.m_flagParalDest[splitTemp[j]];
                                }
                            }
                        }
                        else {
                            this.m_flagParalD = [0, 1, 2, 3];
                        }
                    }
                    return this.m_flagRow;
                }
            }
            else {
                this.m_errorPad[this.m_errorCounter] = "Wrong spelling- missing \'.\'";
                this.m_errorCounter++;
            }
        }
    };
    CParseToGetSIMD.prototype.getSIMD = function () {
        return this.m_AmountNum;
    };
    CParseToGetSIMD.prototype.getParalFlag = function () {
        return this.m_flagParal;
    };
    CParseToGetSIMD.prototype.getParalFlagDestin = function () {
        return this.m_flagParalD;
    };
    CParseToGetSIMD.prototype.isWithFlag = function () {
        if (this.m_Funct.search('f') > -1 ||
            this.m_command.search('(eq)') != -1)
            return 1;
        else
            return 0;
    };
    return CParseToGetSIMD;
})();
var CParseToGetIGCSIMD = (function (_super) {
    __extends(CParseToGetIGCSIMD, _super);
    function CParseToGetIGCSIMD() {
        _super.apply(this, arguments);
    }
    CParseToGetIGCSIMD.prototype.divide = function () {
        var com = this.m_command;
        if (this.m_command.indexOf("(W") != -1) {
            var tem = this.m_command.split("(W");
            if (tem[1]) {
                com = tem[1];
            }
        }
        if (com.indexOf("|") > -1) {
            var temp = com.split("|");
            var temp2 = [];
            if (temp[0]) {
                if (temp[0].indexOf("(") != -1) {
                    temp2 = temp[0].split("(");
                    if (temp2[1])
                        this.m_AmountNum = parseInt(temp2[1], 10);
                    if (temp2[0].indexOf(")") != -1) {
                        var temp4 = temp2[0].split(")");
                        if (temp4[1])
                            this.m_Funct = temp4[1];
                    }
                    else {
                        this.m_Funct = temp2[0];
                    }
                }
            }
        }
    };
    return CParseToGetIGCSIMD;
})(CParseToGetSIMD);
var CParseSerialDestination = (function () {
    function CParseSerialDestination(c) {
        this.m_TypeOfWord = {};
        this.m_TypeOfParralWord = {};
        this.m_errorPad = [];
        this.m_command = c;
        this.m_TypeOfWord['w'] = 2;
        this.m_TypeOfWord['uw'] = 2;
        this.m_TypeOfWord['b'] = 1;
        this.m_TypeOfWord['d'] = 4;
        this.m_TypeOfWord['ud'] = 4;
        this.m_TypeOfWord['q'] = 8;
        this.m_TypeOfWord['uq'] = 8;
        this.m_TypeOfWord['f'] = 4;
        this.m_TypeOfWord['df'] = 8;
        this.m_TypeOfWord['hf'] = 2;
        this.m_TypeOfWord['uf'] = 4;
        this.m_TypeOfParralWord['x'] = 0;
        this.m_TypeOfParralWord['y'] = 1;
        this.m_TypeOfParralWord['z'] = 2;
        this.m_TypeOfParralWord['w'] = 3;
        this.m_TypeOfParralWord['r'] = 0;
        this.m_errorCounter = 0;
        this.m_errorFlag = 0;
        this.m_ARFflag = 0;
        this.m_flagRegioning = 0;
    }
    CParseSerialDestination.prototype.divide = function () {
        if (this.m_command.indexOf("]") == -1) {
            if (this.m_command.indexOf("f0.") > -1 ||
                this.m_command.indexOf("f1.") > -1) {
                this.m_flagRegioning = 1;
                this.m_ARFflag = 0;
                if (this.m_command.indexOf("f0.") > -1) {
                    this.m_SubRegNum = 0;
                    if (this.m_command.indexOf("f0.0") > -1) {
                        this.m_RegNum = this.m_flagRegioningLabel = 0;
                    }
                    else if (this.m_command.indexOf("f0.1") != -1) {
                        this.m_RegNum = this.m_flagRegioningLabel = 1;
                    }
                }
                else if (this.m_command.indexOf("f1.") != -1) {
                    this.m_SubRegNum = 0;
                    if (this.m_command.indexOf("f1.0") > -1) {
                        this.m_RegNum = this.m_flagRegioningLabel = 2;
                    }
                    else if (this.m_command.indexOf("f1.1") != -1) {
                        this.m_RegNum = this.m_flagRegioningLabel = 3;
                    }
                }
                this.parse(this.m_command);
            }
            else {
                this.m_ARFflag = 0;
                this.m_flagRegioning = 0;
                if (this.m_command.indexOf(".") != -1) {
                    var tempR = this.m_command.split(".");
                    this.m_RegNum = parseInt((tempR[0]), 10);
                    if (tempR[1]) {
                        this.parse(tempR[1]);
                    }
                    else {
                        this.m_errorPad[this.m_errorCounter] = "Wrong spelling- missing <";
                        this.m_errorCounter++;
                        this.m_errorFlag = 1;
                    }
                }
                else {
                    this.m_errorPad[this.m_errorCounter] = "Wrong spelling- missing \'.\'";
                    this.m_errorCounter++;
                    this.m_errorFlag = 1;
                }
            }
        }
        else {
            this.m_ARFflag = 1;
            this.m_flagRegioning = 0;
            var tempS = this.m_command.split("]");
            if (tempS[0].indexOf("[") != -1) {
                var tempRe = tempS[0].split("[");
                if (tempRe[1]) {
                    if (tempRe[1].search(",") != -1) {
                        var tempR = tempRe[1].split(",");
                        this.m_SubRegNum = parseInt(tempR[1], 10);
                        this.m_RegNum = 0;
                        this.m_ARFlabel = tempR[0];
                    }
                    else {
                        this.m_ARFlabel = tempRe[1];
                        this.m_SubRegNum = 0;
                        this.m_RegNum = 1;
                    }
                }
                else {
                    this.m_errorFlag = 1;
                }
                if (tempS[1]) {
                    if (tempS[1].search(">") != -1) {
                        var temps = tempS[1].split(">");
                        if (temps[1].search(":") != -1) {
                            this.m_TypeStr = temps[1].split(":")[1];
                        }
                        else {
                            this.m_errorPad[this.m_errorCounter] = "Wrong spelling- missing type";
                            this.m_errorCounter++;
                            this.m_errorFlag = 1;
                        }
                        if (temps[0].search("<") != -1) {
                            var tempSS = temps[0].split("<");
                            if (tempSS[1])
                                this.m_Width = parseInt(tempSS[1], 10);
                        }
                        else {
                            this.m_errorPad[this.m_errorCounter] = "Wrong spelling- missing <";
                            this.m_errorCounter++;
                            this.m_errorFlag = 1;
                        }
                    }
                }
            }
            else {
                this.m_errorPad[this.m_errorCounter] = "Wrong spelling- something wrong with [] brackets";
                this.m_errorCounter++;
                this.m_errorFlag = 1;
            }
        }
    };
    CParseSerialDestination.prototype.getFlagFlag = function () {
        return this.m_flagRegioning;
    };
    CParseSerialDestination.prototype.getFlagLabel = function () {
        return this.m_flagRegioningLabel;
    };
    CParseSerialDestination.prototype.getErrorList = function () {
        return this.m_errorPad;
    };
    CParseSerialDestination.prototype.getARFflag = function () {
        return this.m_ARFflag;
    };
    CParseSerialDestination.prototype.getARFLabel = function () {
        return this.m_ARFlabel;
    };
    CParseSerialDestination.prototype.getRow = function () {
        return this.m_RegNum;
    };
    CParseSerialDestination.prototype.getStep = function () {
        return this.m_Width;
    };
    CParseSerialDestination.prototype.getThisType = function () {
        return this.m_Type;
    };
    CParseSerialDestination.prototype.getType = function () {
        switch (this.m_TypeStr) {
            case 'w':
                {
                    this.m_Type = 2;
                }
                break;
            case 'uw':
                {
                    this.m_Type = 2;
                }
                break;
            case 'b':
                {
                    this.m_Type = 1;
                }
                break;
            case 'd':
                {
                    this.m_Type = 4;
                }
                break;
            case 'ud':
                {
                    this.m_Type = 4;
                }
                break;
            case 'q':
                {
                    this.m_Type = 8;
                }
                break;
            case 'uq':
                {
                    this.m_Type = 8;
                }
                break;
            case 'f':
                {
                    this.m_Type = 4;
                }
                break;
            case 'uf':
                {
                    this.m_Type = 4;
                }
                break;
            case 'df':
                {
                    this.m_Type = 8;
                }
                break;
            case 'hf':
                {
                    this.m_Type = 2;
                }
                break;
            default:
                this.m_Type = 1;
                break;
        }
    };
    CParseSerialDestination.prototype.isNull = function () {
        if (this.m_command.search('(eq)') != -1)
            return 1;
        else
            return 0;
    };
    CParseSerialDestination.prototype.draw = function (tab, extNum, a) {
        this.getType();
        tab.colorDestSerial(this.m_RegNum, this.m_SubRegNum, a, this.getStep(), this.getThisType(), extNum);
    };
    CParseSerialDestination.prototype.getTypeStr = function () {
        return this.m_TypeStr;
    };
    CParseSerialDestination.prototype.getSuReg = function () {
        return this.m_SubRegNum;
    };
    CParseSerialDestination.prototype.parse = function (temp) {
        if (temp.indexOf("<") != -1) {
            var tempRe = temp.split("<");
            this.m_SubRegNum = parseInt((tempRe[0]), 10);
            if (tempRe[1]) {
                if (tempRe[1].indexOf(">") != -1) {
                    var tempReg = tempRe[1].split(">");
                    this.m_Width = parseInt((tempReg[0]), 10);
                    if (tempReg[1]) {
                        if (tempReg[1].indexOf(":") != -1) {
                            var tempT = tempReg[1].split(":");
                            this.m_TypeStr = tempT[1];
                        }
                    }
                    else {
                        this.m_errorPad[this.m_errorCounter] = "Wrong spelling- missing : in: " + tempRe[1];
                        this.m_errorCounter++;
                        this.m_errorFlag = 1;
                    }
                }
            }
            else {
                this.m_errorPad[this.m_errorCounter] = "Wrong spelling- missing >";
                this.m_errorCounter++;
                this.m_errorFlag = 1;
            }
        }
        else {
            var tempSend = new CParseSerialDestinationSend(this.m_command);
            tempSend.divide();
            tempSend.getThisType();
            this.m_TypeStr = tempSend.getTypeStr();
            this.m_SubRegNum = tempSend.getSuReg();
            this.m_Type = tempSend.getThisType();
            this.m_Width = tempSend.getStep();
            this.m_errorPad[this.m_errorCounter] = "Send instruction- need to decode in: " + this.m_command;
            this.m_errorCounter++;
            this.m_errorFlag = 1;
        }
    };
    return CParseSerialDestination;
})();
var CParseSerialDestinationSend = (function (_super) {
    __extends(CParseSerialDestinationSend, _super);
    function CParseSerialDestinationSend() {
        _super.apply(this, arguments);
    }
    CParseSerialDestinationSend.prototype.divide = function () {
        if (this.m_command.indexOf(":") != -1) {
            var temp = this.m_command.split(":");
            if (temp[1]) {
                this.m_TypeStr = temp[1];
                this.m_Type = this.m_TypeOfWord[temp[1]];
            }
            this.m_RegNum = parseInt(temp[0], 10);
            this.m_SubRegNum = 0;
            if (temp[0].indexOf(".") != -1) {
                var temp2 = temp[0].split(".");
                if (temp2[1]) {
                    this.m_SubRegNum = parseInt(temp2[1], 10);
                }
            }
            this.m_Width = 1;
        }
    };
    return CParseSerialDestinationSend;
})(CParseSerialDestination);
var CParseSerialSource = (function (_super) {
    __extends(CParseSerialSource, _super);
    function CParseSerialSource() {
        _super.apply(this, arguments);
    }
    CParseSerialSource.prototype.divide = function () {
        if (this.m_command.indexOf("]") == -1) {
            this.m_ARFflag = 0;
            if (this.m_command.indexOf("f0.") > -1 ||
                this.m_command.indexOf("f1.") > -1) {
                this.m_flagRegioning = 1;
                this.m_ARFflag = 0;
                if (this.m_command.indexOf("f0.") > -1) {
                    this.m_SubRegNum = 0;
                    if (this.m_command.indexOf("f0.0") > -1) {
                        this.m_RegNum = this.m_flagRegioningLabel = 0;
                    }
                    else if (this.m_command.indexOf("f0.1") != -1) {
                        this.m_RegNum = this.m_flagRegioningLabel = 1;
                    }
                }
                else if (this.m_command.indexOf("f1.") != -1) {
                    this.m_SubRegNum = 0;
                    if (this.m_command.indexOf("f1.0") > -1) {
                        this.m_RegNum = this.m_flagRegioningLabel = 2;
                    }
                    else if (this.m_command.indexOf("f1.1") != -1) {
                        this.m_RegNum = this.m_flagRegioningLabel = 3;
                    }
                }
                this.parse2(this.m_command);
            }
            else {
                this.m_flagRegioning = 0;
                if (this.m_command.indexOf(".") != -1) {
                    var tempR = this.m_command.split(".");
                    this.m_RegNum = parseInt((tempR[0]), 10);
                    if (tempR[1]) {
                        this.parse2(tempR[1]);
                    }
                    else {
                        this.m_errorPad[this.m_errorCounter] = "Wrong spelling- missing < in:  " + this.m_command;
                        this.m_errorCounter++;
                        this.m_errorFlag = 1;
                    }
                }
                else {
                    this.m_errorPad[this.m_errorCounter] = "Wrong spelling- missing . in:  " + this.m_command;
                    this.m_errorCounter++;
                    this.m_errorFlag = 1;
                    this.m_RegNum = parseInt(this.m_command, 10);
                    this.m_SubRegNum = 0;
                    this.m_Type = 4;
                    this.m_TypeStr = "d";
                    this.m_Width = 8;
                    this.m_VertStride = 8;
                    this.m_HorzStride = 1;
                }
            }
        }
        else {
            this.m_ARFflag = 1;
            this.m_flagRegioning = 0;
            var tempS = this.m_command.split("]");
            if (tempS[0].indexOf("[") != null) {
                var tempRe = tempS[0].split("[");
                if (tempRe[1]) {
                    if (tempRe[1].indexOf(",") != -1) {
                        var tempR = tempRe[1].split(",");
                        this.m_SubRegNum = parseInt(tempR[1], 10);
                        this.m_RegNum = 0;
                        this.m_ARFlabel = tempR[0];
                    }
                    else {
                        this.m_ARFlabel = tempRe[1];
                        this.m_SubRegNum = 0;
                        this.m_RegNum = 1;
                    }
                }
                else {
                    this.m_errorFlag = 1;
                }
            }
            if (tempS[1]) {
                if (tempS[1].search(">") != -1) {
                    var temps = tempS[1].split(">");
                    if (temps[1]) {
                        if (temps[1].search(":") != -1) {
                            this.m_TypeStr = temps[1].split(":")[1];
                        }
                    }
                    if (temps[0].search("<") != -1) {
                        var tempSS = temps[0].split("<");
                        if (tempSS[1]) {
                            if (tempSS[1].search(";") != -1) {
                                var tempV = tempSS[1].split(";");
                                this.m_VertStride = parseInt(tempV[0], 10);
                                if (tempV[1]) {
                                    if (tempV[1].search(",") != -1) {
                                        var tempH = tempV[1].split(",");
                                        this.m_Width = parseInt(tempH[0], 10);
                                        this.m_HorzStride = parseInt(tempH[1], 10);
                                    }
                                }
                                else {
                                    this.m_errorPad[this.m_errorCounter] = "Wrong spelling- missing , in:  " + tempSS[1];
                                    this.m_errorCounter++;
                                    this.m_errorFlag = 1;
                                }
                            }
                            else if (tempSS[1].search(",") != -1) {
                            }
                        }
                        else {
                            this.m_errorPad[this.m_errorCounter] = "Wrong spelling- missing ; in:  " + temps[0];
                            this.m_errorCounter++;
                            this.m_errorFlag = 1;
                        }
                    }
                    else {
                        this.m_errorPad[this.m_errorCounter] = "Wrong spelling- missing < in:  " + temps[0];
                        this.m_errorCounter++;
                        this.m_errorFlag = 1;
                    }
                }
            }
            else {
                this.m_errorPad[this.m_errorCounter] = "Wrong spelling- missing > in:  " + this.m_command;
                this.m_errorCounter++;
                this.m_errorFlag = 1;
            }
        }
    };
    CParseSerialSource.prototype.getV = function () {
        return this.m_VertStride;
    };
    CParseSerialSource.prototype.getH = function () {
        return this.m_HorzStride;
    };
    CParseSerialSource.prototype.getARFflag = function () {
        return this.m_ARFflag;
    };
    CParseSerialSource.prototype.getARFLabel = function () {
        return this.m_ARFlabel;
    };
    CParseSerialSource.prototype.getW = function () {
        return this.m_Width;
    };
    CParseSerialSource.prototype.drawSerialSourc = function (tab, extNum, color, filerNumber) {
        tab.colorSourceSerial(this.m_RegNum, this.m_SubRegNum, this.m_Width, this.m_VertStride, this.m_HorzStride, this.m_Type, color, extNum, filerNumber);
    };
    CParseSerialSource.prototype.parse2 = function (temp) {
        if (temp.search("<") != -1) {
            var tempRe = temp.split("<");
            if (this.m_flagRegioning == 0)
                this.m_SubRegNum = parseInt((tempRe[0]), 10);
            if (tempRe[1]) {
                if (tempRe[1].search(";") != -1) {
                    var tempH = tempRe[1].split(";");
                    this.m_VertStride = parseInt((tempH[0]), 10);
                    if (tempH[1]) {
                        if (tempH[1].search(",") != -1) {
                            var tempW = tempH[1].split(",");
                            this.m_Width = parseInt((tempW[0]), 10);
                            if (tempW[1]) {
                                if (tempW[1].search(">") != -1) {
                                    var tempV = tempW[1].split(">");
                                    this.m_HorzStride = parseInt((tempV[0]), 10);
                                    if (tempV[1]) {
                                        if (tempV[1].search(":") != -1) {
                                            var tempT = tempV[1].split(":");
                                            this.m_TypeStr = tempT[1];
                                        }
                                    }
                                    else {
                                        this.m_errorPad[this.m_errorCounter] = "Wrong spelling- missing : type";
                                        this.m_errorCounter++;
                                        this.m_errorFlag = 1;
                                    }
                                }
                            }
                            else {
                                this.m_errorPad[this.m_errorCounter] = "Wrong spelling- missing > in:  " + tempH[1];
                                this.m_errorCounter++;
                                this.m_errorFlag = 1;
                            }
                        }
                    }
                    else {
                        this.m_errorPad[this.m_errorCounter] = "Wrong spelling- missing , in:  " + tempRe[1];
                        this.m_errorCounter++;
                        this.m_errorFlag = 1;
                    }
                }
            }
            else {
                this.m_errorPad[this.m_errorCounter] = "Wrong spelling- missing ; in:  " + temp;
                this.m_errorCounter++;
                this.m_errorFlag = 1;
            }
        }
        else {
            this.m_RegNum = parseInt(temp, 10);
            this.m_SubRegNum = 0;
            this.m_Type = 1;
            this.m_Width = 32;
        }
    };
    return CParseSerialSource;
})(CParseSerialDestination);
var CParseSerialSourceSend = (function (_super) {
    __extends(CParseSerialSourceSend, _super);
    function CParseSerialSourceSend(com, regNum) {
        _super.call(this, com);
        this.m_RegFile = regNum;
    }
    CParseSerialSourceSend.prototype.divide = function () {
        if (this.m_command.indexOf(":") != -1) {
            var temp = this.m_command.split(":");
            if (temp[1]) {
                this.m_TypeStr = temp[1];
                this.m_Type = this.m_TypeOfWord[temp[1]];
            }
            this.m_RegNum = parseInt(temp[0], 10);
            this.m_SubRegNum = 0;
            this.m_VertStride = this.m_RegFile;
            this.m_HorzStride = 1;
            this.m_Width = this.m_VertStride;
        }
    };
    return CParseSerialSourceSend;
})(CParseSerialSource);
var CParseParralelSource = (function (_super) {
    __extends(CParseParralelSource, _super);
    function CParseParralelSource() {
        _super.apply(this, arguments);
        this.m_line = [];
        this.m_cell = [];
    }
    CParseParralelSource.prototype.divide = function () {
        if (this.m_command.indexOf("]") == -1) {
            this.m_ARFflag = 0;
            if (this.m_command.search(".") != -1) {
                var tempR = this.m_command.split(".");
                this.m_RegNum = parseInt((tempR[0]), 10);
                if (tempR[1]) {
                    if (tempR[1].search("<") != -1) {
                        var tempS = tempR[1].split("<");
                        this.m_SubRegNum = parseInt((tempS[0]), 10);
                        this.m_Width = parseInt((tempS[1]), 10);
                        if (tempR[2]) {
                            if (tempR[2].search(":") != -1) {
                                var tempT = tempR[2].split(":");
                                if (tempT[1])
                                    this.m_TypeStr = tempT[1];
                                else {
                                    this.m_errorPad[this.m_errorCounter] = "Wrong spelling- missing Type in:  " + tempR[2];
                                    this.m_errorCounter++;
                                    this.m_errorFlag = 1;
                                }
                                if (tempT[0]) {
                                    var restOfIt = tempT[0].split('');
                                    for (var i = 0; i < restOfIt.length; i++) {
                                        this.m_line[i] = restOfIt[i];
                                    }
                                    if (this.m_line)
                                        this.getNumbers();
                                    else {
                                        this.m_errorPad[this.m_errorCounter] = "Wrong spelling- no x,y,z,w regions in:  " + restOfIt;
                                        this.m_errorCounter++;
                                        this.m_errorFlag = 1;
                                    }
                                }
                                else {
                                    this.m_errorPad[this.m_errorCounter] = "Wrong spelling- missing x,y,z,w in:  " + tempR[2];
                                    this.m_errorCounter++;
                                    this.m_errorFlag = 1;
                                }
                            }
                        }
                        else {
                            this.m_errorPad[this.m_errorCounter] = "Wrong spelling- missing : in:  " + tempR[1];
                            this.m_errorCounter++;
                            this.m_errorFlag = 1;
                        }
                    }
                }
                else {
                    this.m_errorPad[this.m_errorCounter] = "Wrong spelling- missing < in:  " + this.m_command;
                    this.m_errorCounter++;
                    this.m_errorFlag = 1;
                }
            }
            else {
                this.m_errorPad[this.m_errorCounter] = "Wrong spelling- missing . in:  " + this.m_command;
                this.m_errorCounter++;
                this.m_errorFlag = 1;
            }
        }
        else {
            this.m_ARFflag = 1;
            var tempS = this.m_command.split("]");
            if (tempS[0].indexOf("[") != null) {
                var tempRe = tempS[0].split("[");
                if (tempRe[1]) {
                    if (tempRe[1].search(",") != -1) {
                        var tempR = tempRe[1].split(",");
                        this.m_SubRegNum = parseInt(tempR[1], 10);
                        this.m_RegNum = 0;
                        this.m_ARFlabel = tempR[0];
                    }
                    else {
                        this.m_ARFlabel = tempRe[1];
                        this.m_SubRegNum = 0;
                        this.m_RegNum = 1;
                    }
                }
            }
            if (tempS[1]) {
                if (tempS[1].search(">") != -1) {
                    var temps = tempS[1].split(">");
                    if (temps[1]) {
                        if (temps[1].search(".") != -1) {
                            var line = temps[1].split(".");
                            if (line[1]) {
                                if (line[1].search(":") != -1) {
                                    var line2 = line[1].split(":");
                                    if (line2[1])
                                        this.m_TypeStr = line2[1];
                                    if (line2[0]) {
                                        var restOfIt = line2[0].split('');
                                        for (var i = 0; i < restOfIt.length; i++) {
                                            this.m_line[i] = restOfIt[i];
                                        }
                                        if (this.m_line)
                                            this.getNumbers();
                                    }
                                    else {
                                        this.m_errorPad[this.m_errorCounter] = "Wrong spelling- missing xyzw in:  " + line2[0];
                                        this.m_errorCounter++;
                                        this.m_errorFlag = 1;
                                    }
                                }
                            }
                            else {
                                this.m_errorPad[this.m_errorCounter] = "Wrong spelling- missing type in:  " + line[1];
                                this.m_errorCounter++;
                                this.m_errorFlag = 1;
                            }
                        }
                    }
                    if (temps[0].search("<") != -1) {
                        var tempSS = temps[0].split("<");
                        if (tempSS[1])
                            this.m_Width = parseInt(tempSS[1], 10);
                        else
                            this.m_errorFlag = 1;
                    }
                }
            }
        }
    };
    CParseParralelSource.prototype.drawParalSource = function (tab, extNum, destCells, Color) {
        this.getNumbers();
        if (destCells.length > 0) {
            destCells = destCells;
            if (destCells.length > this.m_cell.length) {
                for (var i = this.m_cell.length; i < destCells.length; i++) {
                    this.m_cell[i] = this.m_cell[this.m_cell.length - 1];
                }
            }
        }
        else {
            destCells = this.m_cell;
        }
        this.getType();
        tab.colorSource(this.m_RegNum, this.m_SubRegNum, this.m_Type, this.m_Width, destCells, this.m_cell, Color, extNum);
    };
    CParseParralelSource.prototype.getString = function () {
        return this.m_line;
    };
    CParseParralelSource.prototype.getNumbers = function () {
        for (var i = 0; i < this.m_line.length; i++) {
            switch (this.m_line[i]) {
                case 'x':
                    {
                        this.m_cell[i] = 0;
                    }
                    break;
                case 'y':
                    {
                        this.m_cell[i] = 1;
                    }
                    break;
                case 'z':
                    {
                        this.m_cell[i] = 2;
                    }
                    break;
                case 'w':
                    {
                        this.m_cell[i] = 3;
                    }
                    break;
                case 'r':
                    {
                        this.m_cell[i] = 0;
                    }
                case 'a':
                    {
                    }
                    break;
                default:
                    break;
            }
        }
        return this.m_cell;
    };
    return CParseParralelSource;
})(CParseSerialSource);
var CParseParallelDestination = (function (_super) {
    __extends(CParseParallelDestination, _super);
    function CParseParallelDestination() {
        _super.apply(this, arguments);
    }
    CParseParallelDestination.prototype.divide = function () {
        if (this.m_command.indexOf("]") == -1) {
            this.m_ARFflag = 0;
            if (this.m_command.search(".") != -1) {
                var tempR = this.m_command.split(".");
                this.m_RegNum = parseInt((tempR[0]), 10);
                this.m_SubRegNum = parseInt((tempR[1]), 10);
                if (tempR[2]) {
                    if (tempR[2].search(":") != -1) {
                        var temp2 = tempR[2].split(":");
                        if (temp2[1]) {
                            this.m_TypeStr = temp2[1];
                        }
                        if (temp2[0]) {
                            var restOfIt = temp2[0].split('');
                            for (var i = 0; i < restOfIt.length; i++) {
                                this.m_line[i] = restOfIt[i];
                            }
                            if (this.m_line[0] != 'a')
                                this.getNumbers();
                        }
                        else {
                            this.m_errorPad[this.m_errorCounter] = "Wrong spelling- missing type in:  " + tempR[2];
                            this.m_errorCounter++;
                            this.m_errorFlag = 1;
                        }
                    }
                }
                else {
                    this.m_errorPad[this.m_errorCounter] = "Wrong spelling- missing type in:  " + this.m_command;
                    this.m_errorCounter++;
                    this.m_errorFlag = 1;
                }
            }
        }
        else {
            this.m_ARFflag = 1;
            var tempS = this.m_command.split("]");
            if (tempS[0].indexOf("[") != null) {
                var tempRe = tempS[0].split("[");
                if (tempRe[1]) {
                    if (tempRe[1].search(",") != -1) {
                        var tempR = tempRe[1].split(",");
                        this.m_SubRegNum = parseInt(tempR[1], 10);
                        this.m_RegNum = 0;
                        this.m_ARFlabel = tempR[0];
                    }
                    else {
                        this.m_ARFlabel = tempRe[1];
                        this.m_SubRegNum = 0;
                        this.m_RegNum = 1;
                    }
                }
            }
            if (tempS[1]) {
                if (tempS[1].search(":") != -1) {
                    var temp2 = tempR[2].split(":");
                    if (temp2[1]) {
                        this.m_TypeStr = temp2[1];
                    }
                    if (temp2[0]) {
                        var restOfIt = temp2[0].split('');
                        for (var i = 0; i < restOfIt.length; i++) {
                            this.m_line[i] = restOfIt[i];
                        }
                        if (this.m_line[0] != 'a')
                            this.getNumbers();
                    }
                    else {
                        this.m_errorPad[this.m_errorCounter] = "Wrong spelling- missing type in:  " + tempR[2];
                        this.m_errorCounter++;
                        this.m_errorFlag = 1;
                    }
                }
            }
            else {
                this.m_errorPad[this.m_errorCounter] = "Wrong spelling- missing type in:  " + this.m_command;
                this.m_errorCounter++;
                this.m_errorFlag = 1;
            }
        }
    };
    CParseParallelDestination.prototype.drawParalDest = function (tab, extNum) {
        tab.colorDestin(this.m_RegNum, this.m_SubRegNum, this.m_Type, this.m_cell, extNum);
    };
    return CParseParallelDestination;
})(CParseParralelSource);
