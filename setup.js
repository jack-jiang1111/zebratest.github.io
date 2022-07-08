///<reference path="table.ts"/>
///<reference path="parse.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*****************************************************************************\
 
Class:parseRegion
 
Description: to detect if the string line is single or not, and set up for next parse, collecting cell flag,
             inserting the instruction colored correctly under each regioning table
 
\*****************************************************************************/
var CParseRegion = (function () {
    function CParseRegion(a, k) {
        this.m_list = []; // line for parsing
        this.m_BackUpList = []; // line for displaying all instruction
        this.m_colorCommand = []; // divided instruction line for coloring
        this.m_setColorCommand = {}; // map with colors to color the dispayed instruction
        this.m_ErrorList = [];
        this.m_commandLine = a; //geting the string
        this.m_newParse = new CPrimalParse(a);
        this.m_newParse.divide(); // dividing string for next
        this.m_sendFlag = this.m_newParse.isSend();
        if (this.m_sendFlag == 1) {
            this.sendHexadecima = this.m_newParse.getHexadecimal();
        }
        this.m_list = this.m_newParse.returnCommandc();
        var tempParse = new CPrimalParse(a);
        tempParse.divide();
        this.m_BackUpList = tempParse.returnCommandc();
        this.m_typeOfRegioning = this.m_newParse.isSerial();
        this.m_typeOfInstruction = this.m_newParse.isSingle();
        this.m_addFromNewParse = k; // get the last mov number 
        this.m_add = 0;
        this.m_setColorCommand[0] = "black";
        this.m_setColorCommand[1] = color_dest;
        this.m_setColorCommand[2] = color_source0;
        this.m_setColorCommand[3] = color_source1;
        this.m_setColorCommand[4] = color_source2;
        this.m_errorCounter = 0;
        this.m_ErrorList[this.m_errorCounter] = new Array();
        this.m_ErrorList[this.m_errorCounter] = this.m_newParse.getErrorList();
        this.m_errorCounter++;
    }
    CParseRegion.prototype.getSendFlag = function () {
        return this.m_sendFlag;
    };
    CParseRegion.prototype.getHexa = function () {
        return this.sendHexadecima;
    };
    CParseRegion.prototype.parsing = function () {
        if (this.m_typeOfRegioning == 1 &&
            this.m_list[0].indexOf('f') > -1)
            this.findCellFlag();
        if (this.m_list[0]) {
            if (this.m_list[0].indexOf("-") != -1 ||
                this.m_list[0].indexOf("+") != -1)
                this.checkList();
            if (this.m_list[0] != '0') {
                if (this.m_typeOfInstruction == 0) {
                    if (!this.m_typeOfRegioning) {
                        if (this.m_newParse.isIGC() == 0)
                            var tem1 = new CParseToGetSIMD(this.m_list[0]); // simd
                        else
                            var tem1 = new CParseToGetIGCSIMD(this.m_list[0]);
                        tem1.divide();
                        if (tem1.getErrorList() != null) {
                            this.m_ErrorList[this.m_errorCounter] = tem1.getErrorList();
                            this.m_errorCounter++;
                        }
                        if (this.m_newParse.isSend() == 0)
                            var tem2 = new CParseSerialDestination(this.m_list[1]); // dest
                        else
                            var tem2 = new CParseSerialDestinationSend(this.m_list[1]);
                        if (this.m_newParse.returnCommandc().length > 2) {
                            var tem3 = [];
                            for (var i = 0; i < this.m_newParse.returnCommandc().length - 2; i++) {
                                if (this.m_newParse.isSend() == 0)
                                    tem3[i] = new CParseSerialSource(this.m_list[i + 2]); // source 
                                else {
                                    var licz = tem1.getSIMD();
                                    tem3[i] = new CParseSerialSourceSend(this.m_list[i + 2], tem1.getSIMD());
                                }
                            }
                        }
                        var temp = new CLastSetUpForSerial(tem1, this.m_addFromNewParse, this.m_newParse.returnNullFlag(), tem2, tem3);
                        temp.findfWhichFunct(this.m_typeOfRegioning);
                        this.m_add = temp.getAdditionalTables();
                    }
                    else {
                        if (this.m_newParse.isIGC() == 0)
                            var tem1 = new CParseToGetSIMD(this.m_list[0]); // simd
                        else
                            var tem1 = new CParseToGetIGCSIMD(this.m_list[0]); // simd always should be 8 not 16
                        tem1.divide();
                        if (tem1.getErrorList() != null) {
                            this.m_ErrorList[this.m_errorCounter] = tem1.getErrorList();
                            this.m_errorCounter++;
                        }
                        var temp2;
                        temp2 = new CParseParallelDestination(this.m_list[1]); // dest                   
                        var temp3 = [];
                        if (tem1.getFunct().search("mad") > -1) {
                            for (var i = 0; i < this.m_newParse.returnCommandc().length - 2; i++) {
                                temp3[i] = new CParseParallelDestination(this.m_list[i + 2]); // source
                            }
                        }
                        else {
                            for (var i = 0; i < this.m_newParse.returnCommandc().length - 2; i++) {
                                temp3[i] = new CParseParralelSource(this.m_list[i + 2]);
                            }
                        }
                        var tempp = new CLastSetUp(tem1, this.m_addFromNewParse, this.m_newParse.returnNullFlag(), temp2, temp3);
                        tempp.findWchichF(this.m_typeOfRegioning);
                        this.m_add = tempp.getAdditionalTables();
                    }
                    for (var i = 0; i < this.m_BackUpList.length; i++) {
                        if (i != 0) {
                            if (this.m_commandLine.search("null") < 0 &&
                                i == 1) {
                                this.m_colorCommand[i] = " r" + this.m_BackUpList[i]; // getting all r back (divide removes them)
                            }
                            else if (this.m_commandLine.search("null\.") > -1) {
                                if (this.m_commandLine.search("math") < 0) {
                                    if (this.m_BackUpList[i].search('0') > -1 &&
                                        i == 1 &&
                                        this.m_BackUpList[i].indexOf('f0.') < 0 &&
                                        this.m_commandLine.indexOf("(W") < 0) {
                                        var tepq = this.m_BackUpList[i].split('0');
                                        if (this.m_BackUpList[i].indexOf("f0.") < 0)
                                            this.m_colorCommand[i] = "null" + tepq[0] + tepq[1] + "0" + tepq[2];
                                        else
                                            this.m_colorCommand[i] = tepq[0] + tepq[1] + tepq[2];
                                    }
                                    else if (this.m_BackUpList[i].search('0') > -1 &&
                                        i == 1 &&
                                        this.m_BackUpList[i].indexOf('.0') < 0 &&
                                        this.m_BackUpList[i].indexOf('f0.') < 0 &&
                                        this.m_commandLine.indexOf("(W") != -1) {
                                        var tepq = this.m_BackUpList[i].split('0');
                                        if (this.m_BackUpList[i].indexOf("f0.") < 0)
                                            this.m_colorCommand[i] = "null" + tepq[0] + tepq[1] + "0" + tepq[2];
                                        else
                                            this.m_colorCommand[i] = tepq[0] + tepq[1] + tepq[2];
                                    }
                                    else {
                                        this.m_colorCommand[i] = " r" + this.m_BackUpList[i];
                                    }
                                }
                                else {
                                    this.m_colorCommand[i] = " r" + this.m_BackUpList[i];
                                }
                            }
                            else {
                                this.m_colorCommand[i] = " r" + this.m_BackUpList[i]; // getting all r back (divide removes them)
                            }
                        }
                        else
                            this.m_colorCommand[i] = this.m_BackUpList[i] + " ";
                    }
                }
                else {
                    var t;
                    var nrOfRow;
                    var Type;
                    switch (this.m_typeOfInstruction) {
                        case 1:
                            {
                                t = new CParseSerialDestination(this.m_BackUpList[0]);
                                t.divide();
                                /*  if ( t.getErrorList() != null )
                                  {
                                      this.m_ErrorList[this.m_errorCounter] = t.getErrorList();
                                  }*/
                                nrOfRow = t.getRow();
                                Type = t.getType();
                                this.m_typeOfRegioning = 0;
                                var tempT = new CTable(3, 32, "myTable" + this.m_addFromNewParse, this.m_typeOfRegioning, Type, t.getFlagLabel(), nrOfRow - 1, this.m_typeOfRegioning, this.m_CellFlagLine);
                                tempT.addTable();
                                if (this.m_typeOfRegioning)
                                    tempT.getFlagTable("myTable" + this.m_addFromNewParse + "myTable" + this.m_addFromNewParse, "green");
                                t.draw(tempT, 0, 1); // t.GetThisType());
                                tempT.deleteText(0, this.m_typeOfRegioning);
                                this.m_colorCommand[0] = "";
                                if (this.m_colorCommand[0].search("f") > -1)
                                    this.m_colorCommand[1] = "r" + this.m_BackUpList[0];
                                else {
                                    this.m_colorCommand[0] = "";
                                    this.m_colorCommand[1] = "r" + this.m_BackUpList[0];
                                }
                            }
                            break;
                        case 2:
                            {
                                t = new CParseSerialSource(this.m_list[0]);
                                t.divide();
                                /* if ( t.getErrorList() != null )
                                 {
                                     this.m_ErrorList[this.m_errorCounter] = t.getErrorList();
                                 }
                                 else*/
                                {
                                    nrOfRow = t.getRow();
                                    Type = t.getType();
                                    this.m_typeOfRegioning = 0;
                                    var tempT = new CTable(3, 32, "myTable" + this.m_addFromNewParse, this.m_typeOfRegioning, Type, t.getFlagLabel(), nrOfRow - 1, this.m_typeOfRegioning, this.m_CellFlagLine);
                                    tempT.addTable();
                                    if (this.m_typeOfRegioning)
                                        tempT.getFlagTable("myTable" + this.m_addFromNewParse + "myTable" + this.m_addFromNewParse, "green");
                                    t.drawSerialSourc(tempT, 0, "#154360", t.getW());
                                    tempT.deleteText(0, this.m_typeOfRegioning);
                                    this.m_colorCommand[0] = "";
                                    this.m_colorCommand[1] = "";
                                    if (this.m_colorCommand[0].search("f") > -1)
                                        this.m_colorCommand[2] = "r" + this.m_BackUpList[0];
                                    else {
                                        this.m_colorCommand[2] = "";
                                        this.m_colorCommand[3] = "r" + this.m_BackUpList[0];
                                    }
                                }
                            }
                            break;
                        case 3:
                            {
                                t = new CParseParallelDestination(this.m_list[0]);
                                t.divide();
                                /*  if ( t.getErrorList() != null )
                                  {
                                      this.m_ErrorList[this.m_errorCounter] = t.getErrorList();
                                  }
                                  else*/
                                {
                                    nrOfRow = t.getRow();
                                    t.getType();
                                    Type = t.getThisType();
                                    this.m_typeOfRegioning = 1;
                                    t.getNumbers();
                                    var tempT2 = new CTableForParall(3, 32, "myTable" + this.m_addFromNewParse, this.m_typeOfRegioning, Type, t.getFlagLabel(), nrOfRow - 1, this.m_typeOfRegioning, this.m_CellFlagLine);
                                    tempT2.addTable();
                                    if (!this.m_typeOfRegioning)
                                        tempT2.getFlagTable("myTable" + this.m_addFromNewParse + "myTable" + this.m_addFromNewParse, "green");
                                    t.drawParalDest(tempT2, 0);
                                    tempT2.deleteText(0, this.m_typeOfRegioning);
                                    this.m_colorCommand[0] = "";
                                    if (this.m_colorCommand[0].search("f") > -1)
                                        this.m_colorCommand[1] = "r" + this.m_BackUpList[0];
                                    else {
                                        this.m_colorCommand[1] = "";
                                        this.m_colorCommand[2] = "r" + this.m_BackUpList[0];
                                    }
                                }
                            }
                            break;
                        case 4:
                            {
                                t = new CParseParralelSource(this.m_list[0]);
                                t.divide();
                                /*      if ( t.getErrorList() != null )
                                      {
                                          this.m_ErrorList[this.m_errorCounter] = t.getErrorList();
                                      }
                                      else*/
                                {
                                    nrOfRow = t.getRow();
                                    t.getType();
                                    Type = t.getThisType();
                                    this.m_typeOfRegioning = 1;
                                    var tempT2 = new CTableForParall(3, 32, "myTable" + this.m_addFromNewParse, this.m_typeOfRegioning, Type, t.getFlagLabel(), nrOfRow - 1, this.m_typeOfRegioning, this.m_CellFlagLine);
                                    tempT2.addTable();
                                    if (!this.m_typeOfRegioning)
                                        tempT2.getFlagTable("myTable" + this.m_addFromNewParse + "myTable" + this.m_addFromNewParse, "green");
                                    t.drawParalSource(tempT2, 0, t.getNumbers(), "#154360");
                                    tempT2.deleteText(0, this.m_typeOfRegioning);
                                    this.m_colorCommand[0] = "";
                                    this.m_colorCommand[1] = "";
                                    if (this.m_colorCommand[0].search("f") > -1)
                                        this.m_colorCommand[2] = "r" + this.m_BackUpList[0];
                                    else {
                                        this.m_colorCommand[2] = "";
                                        this.m_colorCommand[3] = "r" + this.m_BackUpList[0];
                                    }
                                }
                            }
                            break;
                    }
                }
            }
            else {
                this.m_add = 0;
            }
            this.getColorSetUp();
            this.getLabel();
        }
    };
    CParseRegion.prototype.getAdd = function () {
        return this.m_add; // how many tables we add in one instruction
    };
    CParseRegion.prototype.gerErrorList = function () {
        return this.m_ErrorList;
    };
    CParseRegion.prototype.checkList = function () {
        for (var i = 0; i < this.m_list.length; i++) {
            if (this.m_list[1].search("r") < 0) {
                if (this.m_list[0].indexOf(")") > -1) {
                    var temp = this.m_list[0].split(")");
                    if (temp[1].indexOf("(") > -1) {
                        if (temp[0].search("f") > -1) {
                            var temp3 = temp[0].split("f");
                        }
                        var temp2 = temp[1].split("(");
                        if (i == 0) {
                            this.m_list[0] = temp2[0] + ".f" + temp3[1] + "(" + temp2[1] + ")"; // insert data in one string that there would be no errors
                        }
                    }
                }
            }
        }
    };
    CParseRegion.prototype.findCellFlag = function () {
        for (var i = 0; i < this.m_list.length; i++) {
            if (this.m_list[1].search("f") < 0) {
                var temp = this.m_list[0].split("f");
                if (temp[1].search(".") > -1) {
                    var temp2 = temp[1].split('.');
                    if (temp2[2]) {
                        var temp3 = temp2[2].split('');
                        if (temp3[0] != 'z' ||
                            temp3[0] != 'w' ||
                            temp3[0] != 'y' ||
                            temp3[0] != 'x ')
                            this.m_CellFlagLine = [0, 1, 2, 3];
                        else {
                            for (var j = 0; j < 4; j++) {
                                if (temp3[j] != 'z' ||
                                    temp3[j] != 'w' ||
                                    temp3[j] != 'y' ||
                                    temp3[j] != 'x') {
                                    j = 4;
                                }
                                else {
                                    switch (temp3[i]) {
                                        case 'x':
                                            this.m_CellFlagLine[j] = 0;
                                            break;
                                        case 'y':
                                            this.m_CellFlagLine[j] = 1;
                                            break;
                                        case 'z':
                                            this.m_CellFlagLine[j] = 2;
                                            break;
                                        case 'w':
                                            this.m_CellFlagLine[j] = 3;
                                            break;
                                    } // switch string to a number
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    CParseRegion.prototype.getColorSetUp = function () {
        if (this.m_list[0] != '0') {
            if (this.m_BackUpList[0] != this.m_list[0]) {
                if (this.m_BackUpList[0].indexOf("+f") != 0 ||
                    this.m_BackUpList[0].indexOf("-f") != 0)
                    this.m_list[0] = this.m_BackUpList[0];
            }
            for (var i = 0; i < this.m_colorCommand.length; i++) {
                if (this.m_colorCommand[i].search("rf") > -1) {
                    var temp = this.m_colorCommand[i].split("rf");
                    this.m_colorCommand[i] = temp[0] + "f" + temp[1];
                }
                if (this.m_colorCommand[i].indexOf("rnull") != -1) {
                    var temp = this.m_colorCommand[i].split("rnull");
                    this.m_colorCommand[i] = temp[0] + "null" + temp[1];
                }
                if (this.m_colorCommand[i].search('.a') > -1) {
                    var tempomat = this.m_colorCommand[i].split('.a');
                    this.m_colorCommand[i] = tempomat.join('');
                }
                if (this.m_colorCommand[i].search('o') == 0) {
                    var tempomat = this.m_colorCommand[i].split('o');
                    this.m_colorCommand[i] = tempomat[0] + "or" + tempomat[1];
                }
                var tempComL = this.m_commandLine.split(' ');
                var tempcomLi = tempComL.join('');
                if (tempcomLi.search('\.r') > -1) {
                    var tempComLin = tempcomLi.split('r');
                    for (var j = tempComLin.length - 1; j > 0; j--) {
                        if (tempComLin[j].search(":") == 0 ||
                            tempComLin[j].search(":") == 1) {
                            if (tempComLin[j - 1]) {
                                tempComLin[j - 1] = tempComLin[j - 1] + 'r' + tempComLin[j];
                                for (var k = j; k < tempComLin.length; k++) {
                                    tempComLin[k] = tempComLin[k + 1];
                                }
                                tempComLin.length--;
                                j--;
                            }
                        }
                    }
                    if (tempComLin[i]) {
                        if (this.m_colorCommand[i] != tempComLin[i] &&
                            tempComLin[i].search('.r') > -1) {
                            var tempcol = this.m_colorCommand[i].split('.x');
                            this.m_colorCommand[i] = tempcol[0] + '.r' + tempcol[1] + "  ";
                        }
                    }
                }
            }
            if (this.m_colorCommand[1]) {
                if (this.m_colorCommand[1].search("r") > -1) {
                    var t = this.m_colorCommand[0].search(".f");
                }
            }
            if (this.m_colorCommand[0].search('r') > -1) {
                this.m_colorCommand[0] = this.m_colorCommand[0].split('r')[0] + ' ' + this.m_colorCommand[0].split('r')[1];
            }
        }
        else {
            this.m_colorCommand[0] = this.m_commandLine;
            this.m_colorCommand[1] = " - " + this.m_ErrorList;
        }
    };
    CParseRegion.prototype.getLabel = function () {
        var nope = document.createElement('div'); //creating an element in which we are going to display instruction
        nope.id = "node";
        var trA = document.createElement('tr');
        for (var i = 0; i < this.m_colorCommand.length; i++) {
            var tdA = document.createElement('td');
            tdA.style.color = this.m_setColorCommand[i];
            if (this.m_colorCommand[i])
                tdA.textContent = this.m_colorCommand[i] + "    ";
            trA.appendChild(tdA);
            tdA.id = "dat";
        }
        if (this.m_typeOfInstruction == 0) {
            var tempRest;
            var tempLeft;
            var ta;
            ta = this.m_commandLine.toLowerCase().split(' ');
            tempLeft = ta.join('');
            for (var i = 0; i < this.m_colorCommand.length; i++) {
                if (this.m_colorCommand[i]) {
                    var temo = this.m_colorCommand[i].toLowerCase().split(' ');
                    var com = temo.join('');
                    if (tempLeft != null) {
                        tempRest = tempLeft.split(com); // adding the {} and hexadecimal numbers
                        if (this.m_colorCommand[i + 1]) {
                            if (this.m_colorCommand[i] == this.m_colorCommand[i + 1] &&
                                i + 1 == this.m_colorCommand.length - 1) {
                                if (tempRest[2])
                                    tempLeft = tempRest[2];
                            }
                            else {
                                if (tempRest[1])
                                    tempLeft = tempRest[1];
                            }
                        }
                        else {
                            if (tempRest[1])
                                tempLeft = tempRest[1];
                        }
                    }
                }
            }
            if (tempLeft) {
                if (tempLeft.search('//') > -1) {
                    var tempostat = tempLeft.split('//');
                    var tremp = this.m_commandLine.split('//');
                    tempLeft = tempostat[0] + "  //" + tremp[1];
                }
                if (tempLeft.search('{') > -1) {
                    var tempostat = tempLeft.split('{');
                    tempLeft = tempostat[0] + " {" + tempostat[1];
                }
                if (tempLeft.indexOf('0x') != -1) {
                    var tempostat = tempLeft.split('0x');
                    tempLeft = tempostat[0];
                    for (var i = 1; i < tempostat.length; i++) {
                        tempLeft += " 0x" + tempostat[i];
                    }
                }
                if (tempLeft.indexOf(',') != -1) {
                    var tempostat = tempLeft.split(',');
                    tempLeft = tempostat[0];
                    for (var i = 1; i < tempostat.length; i++) {
                        tempLeft += ", " + tempostat[i];
                    }
                }
            }
            var tdA = document.createElement('td');
            tdA.id = "dat";
            tdA.style.color = this.m_setColorCommand[0]; // coloring
            tdA.textContent = tempLeft + this.m_ErrorList + this.m_newParse.getErrorList();
            trA.appendChild(tdA);
        }
        var tableB = document.createElement('tbody'); // adding
        var tableAA = document.createElement('table');
        var tableA = document.getElementById('TableTable');
        tableAA.appendChild(tableB);
        tableB.appendChild(trA);
        for (var i = 0; i < 3; i++) {
            var tra = document.createElement('tr');
            var tda = document.createElement('td');
            tda.style.height = "30px";
            tda.style.borderBottomColor = "black";
            tra.appendChild(tda);
            tableB.appendChild(tra);
        }
        tdA.appendChild(nope);
        tableA.appendChild(tableAA);
    };
    return CParseRegion;
})();
/*****************************************************************************\
 
Class: LastSetUpForSerial
 
Description: it handles whole serial type instructions
 
\*****************************************************************************/
var CLastSetUpForSerial = (function () {
    function CLastSetUpForSerial(a, nn, n, b, c) {
        this.m_colors = {}; // color for sources parts
        this.m_idTables = {}; // table numbers
        this.m_rows = []; // array that contains all first numbers of row
        this.m_avg = [];
        this.m_ARFflag = []; // array with flags of ARF regions if there is one- 1
        this.m_ARFLabel = []; // array with arf numbers (ex a8.0)
        this.m_ARFnumber = []; // array with arf number of instruction
        this.m_ARFrows = []; // array with rows numbers after searching for arf flags
        this.m_FlagRegion = []; // array with names of flags
        this.m_FlagRegionFlag = []; // array with flags of flags (f0.1 etc)
        this.m_flagRegionNumber = [];
        this.m_flagRegionRows = [];
        this.m_command = a;
        this.m_firstReg = b;
        this.m_secondReg = c;
        this.m_nrOfTable = nn;
        this.m_nrOfCollumns = 32;
        this.m_countOfTables = -1;
        this.m_nullFlag = n;
        this.m_inOneTable = new Array(); // table to organize which row (sources/destinatial) would be in which table
        //this.m_idTables = idTable; // map of tables id- max - still needs upgrade!  
        this.m_colors[1] = color_source0; // map of colors
        this.m_colors[2] = color_source1;
        this.m_colors[3] = color_source2;
        this.m_colors[4] = "blue";
    }
    CLastSetUpForSerial.prototype.findfWhichFunct = function (a) {
        this.m_typeOfReg = a;
        if (this.m_firstReg)
            this.divideAll();
        if (this.m_ARFLabel ||
            this.m_FlagRegion)
            this.findARF();
        /* if ( this.m_FlagRegion )
             this.findFlag();*/
        this.findMINMAX();
        this.getAvgInCorrectOrder();
        this.CheckHowManyTabels();
        this.drawTables();
    };
    CLastSetUpForSerial.prototype.getMin = function () {
        return this.m_min;
    };
    CLastSetUpForSerial.prototype.getMax = function () {
        return this.m_max;
    };
    CLastSetUpForSerial.prototype.getAvg = function () {
        return this.m_avg;
    };
    CLastSetUpForSerial.prototype.getAdditionalTables = function () {
        return this.m_countOfTables;
    };
    CLastSetUpForSerial.prototype.divideAll = function () {
        var count = 0;
        var countFlag = 0;
        var flag = 0;
        this.m_command.divide();
        this.m_firstReg.divide();
        this.m_ARFflag[0] = this.m_firstReg.getARFflag();
        if (this.m_ARFflag[0] == 1) {
            this.m_ARFLabel[count] = this.m_firstReg.getARFLabel();
            this.m_ARFnumber[count] = 0;
            count++;
        }
        this.m_FlagRegionFlag[0] = this.m_firstReg.getFlagFlag();
        if (this.m_FlagRegionFlag[0] == 1) {
            this.m_FlagRegion[countFlag] = this.m_firstReg.getFlagLabel();
            this.m_flagRegionNumber[countFlag] = 0;
            countFlag++;
        }
        this.m_firstReg.getType();
        this.m_rows[0] = this.m_firstReg.getRow();
        if (this.m_secondReg) {
            var size = this.m_secondReg.length;
            for (var i = 0; i < size; i++) {
                this.m_secondReg[i].divide();
                this.m_ARFflag[i + 1] = this.m_secondReg[i].getARFflag();
                if (this.m_ARFflag[i + 1] == 1) {
                    this.m_ARFLabel[count] = this.m_secondReg[i].getARFLabel();
                    this.m_ARFnumber[count] = i + 1;
                    count++;
                }
                this.m_FlagRegionFlag[i + 1] = this.m_secondReg[i].getFlagFlag();
                if (this.m_FlagRegionFlag[i + 1] == 1) {
                    this.m_FlagRegion[countFlag] = this.m_secondReg[i].getFlagLabel();
                    this.m_flagRegionNumber[countFlag] = i + 1;
                    countFlag++;
                }
            }
            if (this.m_secondReg) {
                for (var i = 0; i < this.m_secondReg.length; i++) {
                    this.m_secondReg[i].getType();
                    this.m_rows[i + 1] = this.m_secondReg[i].getRow(); // rows[i] is a array that contains RegNumbers- to draw correct rows in table
                }
            }
        }
        if (this.m_nullFlag == 1) {
            for (var i = 0; i < this.m_rows.length - 1; i++) {
                this.m_rows[i] = this.m_rows[i + 1]; // if there is null we delete first row from the rows to draw
            }
        }
    };
    CLastSetUpForSerial.prototype.findARF = function () {
        var temp;
        var count = 0;
        if (this.m_FlagRegionFlag.length > this.m_ARFflag.length)
            temp = this.m_FlagRegionFlag.length;
        else
            temp = this.m_ARFflag.length;
        for (var i = 0; i < temp; i++) {
            if (this.m_ARFflag[i] == 1) {
                for (var k = i; k < this.m_rows.length; k++) {
                    if (this.m_rows[k])
                        this.m_ARFrows[k] = this.m_rows[k];
                }
            }
            else if (this.m_FlagRegionFlag[i] == 1) {
                this.m_flagRegionRows[count] = this.m_rows[i];
                count++;
                for (var k = i; k < this.m_rows.length; k++) {
                    if (this.m_rows[k] != null) {
                        this.m_ARFrows[k] = this.m_rows[k];
                    }
                }
            }
            else
                this.m_ARFrows[i] = this.m_rows[i];
        }
    };
    /*   protected findFlag()
       {
           for ( var i = 0; i < this.m_FlagRegionFlag.length; i++ )
           {
               
               else
                   this.m_flagRegionRows[i] = this.m_rows[i];
           }
       }*/
    // function to find out which one is min, max and between 
    CLastSetUpForSerial.prototype.findMINMAX = function () {
        this.m_min = 100000;
        this.m_max = -1;
        var howManyMax = 0;
        var HowManyMin = 0;
        /*     if ( this.m_FlagRegion )
                 this.m_ARFrows = this.m_flagRegionRows;*/
        if (this.m_ARFrows.length < 2) {
            this.m_max = this.m_avg[0] = this.m_min = this.m_ARFrows[0];
        }
        for (var i = 0; i < this.m_ARFrows.length; i++) {
            if (this.m_ARFrows[i] > this.m_max) {
                this.m_max = this.m_ARFrows[i];
                howManyMax = 0;
            }
            else if (this.m_ARFrows[i] == this.m_max)
                howManyMax++;
            if (this.m_ARFrows[i] < this.m_min) {
                this.m_min = this.m_ARFrows[i];
                HowManyMin = 0; // each time we zero our counter
            }
            else if (this.m_ARFrows[i] == this.m_min)
                HowManyMin++;
        }
        var j = 0;
        if (howManyMax == 0 ||
            HowManyMin == 0) {
            for (var i = 0; i < this.m_ARFrows.length; i++) {
                if (this.m_ARFrows[i] != this.m_max &&
                    this.m_ARFrows[i] != this.m_min) {
                    this.m_avg[j] = this.m_ARFrows[i];
                    j++;
                }
            }
        }
        if (this.m_ARFrows.length < 3) {
            this.m_avg[0] = this.m_min;
        }
        var k = j;
        if (howManyMax != 0) {
            for (j = k; j < howManyMax + k; j++) {
                this.m_avg[j] = this.m_max; // if there is more then one max, we have to write it to avg- the same with min
            }
        }
        var k = j;
        if (HowManyMin != 0) {
            for (j = k; j < HowManyMin + k; j++) {
                this.m_avg[j] = this.m_min;
            }
        }
    };
    CLastSetUpForSerial.prototype.getAvgInCorrectOrder = function () {
        var temp;
        for (var i = 0; i < this.m_avg.length; i++) {
            for (var j = 1; j < this.m_avg.length; j++) {
                if (this.m_avg[j - 1] > this.m_avg[j]) {
                    temp = this.m_avg[j - 1];
                    this.m_avg[j - 1] = this.m_avg[j];
                    this.m_avg[j] = temp;
                }
            }
        }
    };
    CLastSetUpForSerial.prototype.CheckHowManyTabels = function () {
        if (this.m_max - this.m_min < 8) {
            var temp = 0;
            for (var k = 0; k < this.m_ARFnumber.length; k++) {
                this.m_inOneTable[k] = new Array();
                this.m_inOneTable[k].push(-1);
                temp++;
            }
            for (var k = temp; k < this.m_flagRegionNumber.length; k++) {
                this.m_inOneTable[k] = new Array();
                this.m_inOneTable[k].push(-1);
                temp++;
            }
            if (this.m_rows.length > this.m_inOneTable.length) {
                this.m_inOneTable[temp] = new Array();
                this.m_inOneTable[temp][0] = this.m_min;
                for (var i = 0; i < this.m_avg.length; i++) {
                    this.m_inOneTable[temp][i + 1] = this.m_avg[i];
                }
                this.m_inOneTable[temp][this.m_avg.length + 1] = this.m_max;
                return 1 + temp;
            }
            else
                return temp;
        }
        else {
            var temp = 0;
            for (var k = 0; k < this.m_ARFnumber.length; k++) {
                this.m_inOneTable[k] = new Array();
                this.m_inOneTable[k].push(-1);
                temp++;
            }
            for (var k = temp; k < this.m_flagRegionNumber.length; k++) {
                this.m_inOneTable[k] = new Array();
                this.m_inOneTable[k].push(-1);
                temp++;
            }
            this.getAvgInCorrectOrder();
            var tempT = [];
            tempT.push(this.m_min); // we start with getting everything in one array again
            if (this.m_avg) {
                for (var i = 0; i < this.m_avg.length; i++) {
                    tempT.push(this.m_avg[i]);
                }
            }
            tempT.push(this.m_max);
            var tempCount = 0;
            //  this.m_inOneTable[temp] = new Array();
            // this.m_inOneTable[temp].push( this.m_min );      // then we check if the spaces between the next numbers are greater then 5, if yes, we create "bew" table
            for (var i = 0; i < this.m_avg.length + 2; i++) {
                var bool = 1;
                var boolex = 1;
                for (var j = 0; j < this.m_flagRegionRows.length; j++) {
                    if (tempT[i] == this.m_flagRegionRows[j]) {
                        bool = 0;
                    }
                    if (tempT[i - 1]) {
                        if (tempT[i - 1] == this.m_flagRegionRows[j]) {
                            boolex = 0;
                        }
                    }
                }
                if (bool == 1) {
                    if (tempT[i] - tempT[i - 1] > 5) {
                        tempCount++;
                        this.m_inOneTable[temp + tempCount - 1] = new Array();
                    }
                    else if (i == 0 &&
                        boolex == 1 ||
                        boolex == 0) {
                        tempCount++;
                        this.m_inOneTable[temp + tempCount - 1] = new Array();
                    }
                    else if (this.m_inOneTable[temp + tempCount - 1]) {
                    }
                    else {
                        tempCount++;
                        this.m_inOneTable[temp + tempCount - 1] = new Array();
                    }
                    this.m_inOneTable[temp + tempCount - 1].push(tempT[i]); // for each created table we add all numbers of row that are in that table
                }
            }
            return tempCount + temp;
        }
    };
    CLastSetUpForSerial.prototype.CheckHowManyRows = function (n) {
        var amount = this.m_command.getSIMD();
        this.m_firstReg.getType();
        var type = this.m_firstReg.getThisType();
        if (this.m_firstReg.getStep())
            var step = this.m_firstReg.getStep();
        else
            step = 2;
        var odp = Math.round((amount * type + type * (step - 1) * (amount - 1)) / n);
        return odp;
    };
    CLastSetUpForSerial.prototype.CheckHowManySubRows = function (n, VertStride, Type, HorizStride, Width) {
        var nrOfEnoughRows = Math.round(VertStride / Width + HorizStride / Width);
        return nrOfEnoughRows;
    };
    CLastSetUpForSerial.prototype.drawTables = function () {
        var add = 0;
        var temp = 0;
        var tempT = [];
        for (var i = 0; i < this.m_inOneTable.length - temp; i++) {
            var addd = this.CheckHowManyRows(this.m_nrOfCollumns);
            var add2 = this.m_inOneTable[i][this.m_inOneTable[i].length - 1] - this.m_inOneTable[i][0] + addd;
            var add3 = 0;
            if (this.m_secondReg &&
                this.m_secondReg[i] &&
                this.m_typeOfReg == 0 &&
                this.m_secondReg[i].getV()) {
                for (var t = 1; t < this.m_secondReg.length; t++) {
                    // if ( this.m_secondReg[t].getRow() == this.m_inOneTable[i] )
                    if (this.m_secondReg[t])
                        add3 += this.CheckHowManySubRows(this.m_nrOfCollumns, this.m_secondReg[t].getV(), this.m_secondReg[t].getThisType(), this.m_secondReg[t].getH(), this.m_secondReg[t].getW());
                }
            }
            if (this.m_command.isWithFlag()) {
                var flag = this.m_command.getFlag();
                if (this.m_command.getParalFlag()) {
                    var destFlag = [];
                    destFlag = this.m_command.getParalFlagDestin();
                    for (var j = 0; j < destFlag.length; j++) {
                        if (destFlag[j] == null) {
                            if (destFlag[j - 1])
                                destFlag[j] = destFlag[j - 1];
                        }
                    }
                }
                else {
                    var destFlag = [0, 1, 2, 3];
                }
            }
            this.m_firstReg.getType();
            if (flag > 0 &&
                i > 0) {
                flag == 0;
            }
            var howManyRows = 2 + add2 + add3;
            /*    if ( this.m_flagRegionRows[i] ==  )
                {
                    howManyRows = 4;
                }*/
            if (this.m_typeOfReg == 0) {
                if (this.m_inOneTable[i][0] == -1) {
                    this.m_inOneTable[i][0] = 0;
                    howManyRows = 4;
                }
                tempT[i] = new CTable(howManyRows, this.m_nrOfCollumns, getTableName(i + this.m_nrOfTable), this.m_typeOfReg, this.m_firstReg.getThisType(), this.m_firstReg.getFlagLabel(), this.m_inOneTable[i][0] - 1, flag, destFlag);
            }
            else {
                if (this.m_inOneTable[i][0] == -1)
                    this.m_inOneTable[i][0] = 0;
                tempT[i] = new CTableForParall(2 + add2 + add, this.m_nrOfCollumns, getTableName(i + this.m_nrOfTable), this.m_typeOfReg, this.m_firstReg.getThisType(), this.m_firstReg.getFlagLabel(), this.m_inOneTable[i][0] - 1, flag, destFlag);
            }
        }
        for (var k = 0; k < this.m_ARFnumber.length; k++) {
            tempT[k].addTable(1, this.m_ARFLabel[k]);
            this.m_countOfTables = this.m_countOfTables + 1;
        }
        for (var l = 0; l < this.m_flagRegionNumber.length; l++) {
            tempT[l + k].addTable(0, this.m_ARFLabel[l], this.m_FlagRegion[l]);
            this.m_countOfTables = this.m_countOfTables + 1;
        }
        for (var i = l + k; i < tempT.length; i++) {
            tempT[i].addTable();
            this.m_countOfTables = this.m_countOfTables + 1;
        }
        if (flag)
            tempT[0].getFlagTable(getTableName(0 + this.m_nrOfTable) + getTableName(0 + this.m_nrOfTable), "green");
        if (this.m_FlagRegion[0] == null) {
            for (var j = 0; j < this.m_inOneTable.length; j++) {
                if ((this.m_ARFflag[0] == 1 &&
                    j == 0 &&
                    this.m_inOneTable[j].indexOf(this.m_rows[0]) != -1) ||
                    ((this.m_ARFflag[0] == 0 ||
                        !this.m_ARFLabel) &&
                        this.m_inOneTable[j].indexOf(this.m_rows[0]) != -1)) {
                    if (this.m_nullFlag == 0) {
                        if (this.m_typeOfReg == 0)
                            this.m_firstReg.draw(tempT[j], this.m_rows[0] - this.m_inOneTable[j][0], this.m_command.getSIMD());
                        else {
                            this.m_firstReg.drawParalDest(tempT[j], this.m_rows[0] - this.m_inOneTable[j][0]);
                        }
                    }
                }
            }
            if (this.m_secondReg) {
                for (var i = 0; i < this.m_secondReg.length; i++) {
                    for (var j = 0; j < this.m_inOneTable.length; j++) {
                        if ((this.m_ARFflag[i] == 1 &&
                            j != 0 &&
                            this.m_inOneTable[j].indexOf(this.m_rows[i + 1 - this.m_nullFlag]) != -1) ||
                            ((this.m_ARFflag[i] == 0 ||
                                !this.m_ARFLabel) &&
                                this.m_inOneTable[j].indexOf(this.m_rows[i + 1 - this.m_nullFlag]) != -1)) {
                            if (this.m_typeOfReg == 0)
                                this.m_secondReg[i].drawSerialSourc(tempT[j], this.m_rows[i + 1 - this.m_nullFlag] - this.m_inOneTable[j][0], this.m_colors[i + 1], this.m_command.getSIMD());
                            else
                                this.m_secondReg[i].drawParalSource(tempT[j], this.m_rows[i + 1 - this.m_nullFlag] - this.m_inOneTable[j][0], this.m_firstReg.getNumbers(), this.m_colors[i + 1]);
                        }
                    }
                }
            }
        }
        else {
            var temp = 10;
            for (var i = 0; i < this.m_inOneTable.length; i++) {
                if (this.m_FlagRegionFlag[0] == 1 &&
                    i == 0) {
                    this.drawFirs(tempT[i], i);
                    temp = i;
                    break;
                }
                else if (this.m_FlagRegionFlag[0] == 0 &&
                    this.m_inOneTable[i].indexOf(this.m_rows[0]) != -1) {
                    this.drawFirs(tempT[i], i);
                    break;
                }
            }
            if (this.m_secondReg) {
                this.drawTablesFlags(tempT);
                for (var i = 1; i < this.m_ARFrows.length; i++) {
                    for (var j = 0; j < this.m_inOneTable.length; j++) {
                        if (this.m_FlagRegionFlag[i] == 1 &&
                            temp != 0) {
                            this.drawSec(tempT[j], i - 1, j);
                            break;
                        }
                        else if (this.m_FlagRegionFlag[i] == 1 &&
                            temp == 0) {
                            this.drawSec(tempT[j + 1], i - 1, j + 1);
                            break;
                        }
                        else if (this.m_FlagRegionFlag[i] == 0 &&
                            this.m_inOneTable[j].indexOf(this.m_rows[i - this.m_nullFlag]) != -1 &&
                            temp == 0 &&
                            this.m_rows[i - this.m_nullFlag] == 0) {
                            this.drawSec(tempT[j + 1], i - 1, j + 1);
                            break;
                        }
                        else if (this.m_FlagRegionFlag[i] == 0 &&
                            this.m_inOneTable[j].indexOf(this.m_rows[i - this.m_nullFlag]) != -1) {
                            this.drawSec(tempT[j], i - 1, j);
                            break;
                        }
                    }
                }
            }
        }
        for (var i = 0; i < tempT.length; i++) {
            for (var j = 0; j < this.m_inOneTable.length; j++) {
                if (this.m_inOneTable[j].indexOf(this.m_rows[i]) != -1) {
                    tempT[i].deleteText(this.m_rows[i] - this.m_inOneTable[j][0], this.m_typeOfReg);
                }
            }
        }
    };
    CLastSetUpForSerial.prototype.drawFirs = function (tempT, j) {
        // check in witch table is our dest 
        if (this.m_nullFlag == 0) {
            if (this.m_typeOfReg == 0) {
                var temp = 0;
                if (this.m_FlagRegionFlag[0] == 1) {
                    temp = 1;
                }
                this.m_firstReg.draw(tempT, this.m_rows[0] - this.m_inOneTable[j][0] - temp, this.m_command.getSIMD());
            }
            else {
                this.m_firstReg.drawParalDest(tempT, this.m_rows[0] - this.m_inOneTable[j][0]);
            }
        }
    };
    CLastSetUpForSerial.prototype.drawSec = function (tempT, i, j) {
        if (this.m_typeOfReg == 0)
            this.m_secondReg[i].drawSerialSourc(tempT, this.m_rows[i + 1 - this.m_nullFlag] - this.m_inOneTable[j][0], this.m_colors[i + 1], this.m_command.getSIMD());
        else
            this.m_secondReg[i].drawParalSource(tempT, this.m_rows[i + 1 - this.m_nullFlag] - this.m_inOneTable[j][0], this.m_firstReg.getNumbers(), this.m_colors[i + 1]);
    };
    CLastSetUpForSerial.prototype.drawTablesFlags = function (tempT) {
        for (var i = 0; i < this.m_inOneTable.length; i++) {
            for (var j = 0; j < this.m_FlagRegionFlag.length; j++) {
                if (this.m_inOneTable[i][0] == this.m_flagRegionRows[j] &&
                    this.m_FlagRegionFlag[j] == 1)
                    var temp = 1;
            }
        }
    };
    return CLastSetUpForSerial;
})();
/*****************************************************************************\
 
Class: Last SetUpForParallel
 
Description: handles whole parallel instruction- dividing, adding table
 
\*****************************************************************************/
var CLastSetUp = (function (_super) {
    __extends(CLastSetUp, _super);
    function CLastSetUp(k, d, p, f, h, b) {
        _super.call(this, k, d, p);
        this.m_firstReg = f;
        if (h)
            this.m_secondReg = h;
        if (b)
            this.m_secondReg = b;
    }
    CLastSetUp.prototype.divideThis = function () {
        var count = 0;
        this.m_command.divide();
        this.m_firstReg.divide(); // dividing dest
        this.m_ARFflag[0] = this.m_firstReg.getARFflag();
        if (this.m_ARFflag[0] == 1) {
            this.m_ARFLabel[count] = this.m_firstReg.getARFLabel();
            this.m_ARFnumber[count] = 0;
            count++;
        }
        this.m_firstReg.getType();
        this.m_rows[0] = this.m_firstReg.getRow(); // adding numbers of rows to array
        this.sourceR(this.m_secondReg, count);
        if (this.m_nullFlag == 1) {
            for (var i = 0; i < this.m_rows.length - 1; i++) {
                this.m_rows[i] = this.m_rows[i + 1]; // if there is null, divide first one
            }
        }
    };
    CLastSetUp.prototype.findWchichF = function (a) {
        this.m_typeOfReg = a;
        this.divideThis();
        if (this.m_ARFLabel)
            this.findARF();
        this.findMINMAX();
        this.getAvgInCorrectOrder();
        this.CheckHowManyTabels();
        this.drawTables();
    };
    CLastSetUp.prototype.sourceR = function (a, count) {
        for (var i = 0; i < a.length; i++) {
            a[i].divide();
            this.m_ARFflag[i + 1] = this.m_secondReg[i].getARFflag();
            if (this.m_ARFflag[i + 1] == 1) {
                this.m_ARFLabel[count] = this.m_secondReg[i].getARFLabel();
                this.m_ARFnumber[count] = i + 1;
                count++;
            }
            a[i].getType();
        }
        for (var i = 0; i < a.length; i++) {
            // if(this.rows[i]!=null)
            this.m_rows[i + 1] = a[i].getRow(); // add number of rows into the array
        }
    };
    return CLastSetUp;
})(CLastSetUpForSerial);
/*****************************************************************************\
 
Function: VisualizeClick
 
Description: function for button add, it deletes all the area and divide the string after each "enter"
 
Input: none
 
Output: none
 
\*****************************************************************************/
var listOfErrors = [];
function VisualizeClick() {
    listOfErrors = [];
    var start = new Date().getTime();
    var tabOfNumbers = [];
    var add = 0;
    if (document.getElementById('TableTable')) {
        var deleteT = document.getElementById('TableTable');
        while (document.getElementById('TableTable').hasChildNodes()) {
            deleteT.removeChild(deleteT.firstChild);
        }
    }
    var a = document.getElementById('textA'); // get a command from field
    if (a.value == null ||
        a.value == '') {
        alert("no data to check!");
    }
    else {
        var tab = [];
        var tab2 = [];
        var j = 0;
        var PlatformType = document.getElementById('platforms');
        tab = a.value.split('\n'); // split each instruction 
        var b = document.getElementById("TableTable");
        for (var i = 0; i < tab.length; i++) {
            var tabt = tab[i].split(' ');
            var tabtemp = tabt.join('');
            if (tab[i] == "" ||
                tabtemp == "") {
                j++;
            }
            else
                tab2[i - j] = tab[i];
        }
        for (var i = 0; i < tab2.length; i++) {
            tabOfNumbers[i] = add + i;
            var app = new CParseRegion(tab2[i], i + add);
            app.parsing();
            add += app.getAdd();
            listOfErrors[i + 1] = app.gerErrorList();
            // define a separate function, so that the parameters passed will be bound as closure
            // this way, we can use send_descriptor and id_name 
            function PostDecoder(send_descriptor, id_name) {
                $.ajax({
                    method: "POST",
                    url: "http://zebra.igk.intel.com/proxy.cgi",
                    data: {
                        'input': send_descriptor + " " + PlatformType.value
                    },
                    success: function (data, status, xhr) {
                        xhr.withCredentials = true;
                        if (status == 'success') {
                            $("#" + id_name).html(data).show();
                        }
                    },
                    error: function (data, status, xhr) {
                        if (status == 'error') {
                            $("#" + id_name).html("failure ");
                        }
                    }
                });
            }
            if (app.getSendFlag() == 1 && PlatformType.value != "not-selected") {
                var send_descriptor = app.getHexa();
                var id_name = "ISA_send_decoder_" + i;
                var get = document.getElementById("myTable" + (add + i));
                var p = document.createElement("p");
                p.id = id_name;
                get.appendChild(p);
                PostDecoder(send_descriptor, id_name);
            }
        }
    }
    var end = new Date().getTime();
    listOfErrors[0] = new Array();
    listOfErrors[0][0] = "Script running time: " + (end - start) + " ms";
    // alert( 'done! ' );
    $("#textA").dblclick(function () {
        var t = document.getElementById('textA');
        var numberOfRow = t.value.substr(0, t.selectionStart).split("\n").length;
        var name = '#myTable' + (tabOfNumbers[numberOfRow - 2]);
        /*    var elem = document.getElementById( name );
           elem.scrollIntoView();*/
        $('html, body').animate({
            scrollTop: $(name).offset().top
        }, 1000);
    });
}
/*****************************************************************************\
 
Function: DeleteArea
 
Description: function to clear the table, for button
 
Input: none
 
Output: none
 
\*****************************************************************************/
function DeleteArea() {
    while (listOfErrors.length > 0) {
        listOfErrors.pop();
    }
    if (document.getElementById('TableTable')) {
        var deleteT = document.getElementById('TableTable');
        while (document.getElementById('TableTable').hasChildNodes()) {
            deleteT.removeChild(deleteT.firstChild);
        }
    }
    var a = document.getElementById('textA');
    a.value = '';
}
/*****************************************************************************\
 
Function: GetErrorList
 
Description: function to display a new window with errors/ infos
 
Input: none
 
Output: none
 
\*****************************************************************************/
function GetErrorList() {
    myWindowError = window.open("", "myWindowError", "height=500, width=400, scrollbars=1,titlebar=List");
    myWindowError.document.write("<h1>InfoList</h1>");
    count++;
    if (listOfErrors != null) {
        if (listOfErrors[0] != null) {
            myWindowError.document.write("<h2>" + listOfErrors[0][0] + "</h2>");
            for (var i = 1; i < listOfErrors.length; i++) {
                if (listOfErrors[i][0] == '') {
                }
                else
                    myWindowError.document.write("<h4>" + (i) + ") " + listOfErrors[i] + "</h4>");
            }
        }
    }
    /*
        if ( count % 2 == 1 )
        {
            myWindowError.close();      // when double click disappear the window (to not to double the list)
        }*/
}
/*****************************************************************************\
 
Function: GetHelp
 
Description: function to display a new small window with help instructions
 
Input: none
 
Output: none
 
\*****************************************************************************/
function GetHelp() {
    var myWindowHelp = window.open("", "myWindowHelp", "height=1000, width=800, scrollbars=1,titlebar=List");
    myWindowHelp.document.write("<h2>Help</h2>");
    myWindowHelp.document.write("<p>You can paste more than one ISA instruction. In fact, you can paste whole shader. </p>");
    myWindowHelp.document.write("<p>You can also paste single source or destination, ie. <b>r0.0<8;8,1>:ud</b>. For single destination, Zebra will display only one cell. </p>");
    myWindowHelp.document.write("<p>You can also use it to prototype new blocks of code. For that, comments will be useful and // at beginning of line are supported. </p>");
    myWindowHelp.document.write("<p>You should write channel type after each instruction in { } brackets (with coma after align - temp, it will be improved in next verion), ie. <b>mul(1) r95.0<1>:ud r0.1<0;1,0>:ud r1.3<0;1,0>:ud {align1,}</b>.</p>");
    myWindowHelp.document.write("<p>Zebra draws tables with columns according to datatype size. Be default its in bytes, you can change it with <b>Table granularity</b> dropdown. </p>");
    myWindowHelp.document.write("</br><p>USC and IGC isa syntax is supported. </p>");
    myWindowHelp.document.write("<p>Flag registers are drawn. ARF registers are also supported. </p>");
    myWindowHelp.document.write("<p>Every common browser should be supported. </p>");
    myWindowHelp.document.write("<p>Send descriptors are automatically decoded, provided you choose the platform type. </p>");
    myWindowHelp.document.write("</br><p>If there is error in ISA syntax, only instruction will be displayed, without regioning table. Error will be displayed next to instruction and in separate Info List.</p>");
    myWindowHelp.document.write("<p>If you move mouse inside of regioning table, you will see inside each cell its column number.</p>");
    myWindowHelp.document.write("<p>CTRL+ENTER while inside a textbox, refreshes the view without having to click Visualize.</p>");
    myWindowHelp.document.write("<p>If you double click on the instruction in textbox, browser will scroll to its regioning table. </p>");
    myWindowHelp.document.write("</br><p>Code is written in TypeScript, compiled to JavaScript. So you can see it in browser View source. You can even change it there and debug with browser integrated dev tools. </p>");
    myWindowHelp.document.write("<p>You can find sources at p4 mapping: <b>//gfx_DevTest/mainline/Test/Tools/Zebra/</b>  There is also doc on how to build it for yourself. Patches with fixes are welcome! </p>");
    myWindowHelp.document.write("<p>Found a bug? Feature request? Contact person: Hubert Rutkowski (if absent, manager Krzysztof Mazurkiewicz). Originally created by Karolina Pudlo. </p>");
    myWindowHelp.document.write("<br/><h3>Legend to better understand colorings: </h3>");
    myWindowHelp.document.write("<link rel=\"stylesheet\" href= \"zebra.css\" type= \"text/css\" />");
    myWindowHelp.document.write("<div id=\"src0_forbidden_gradient\" style=\"width:50px; height:40px;\"></div><span>Source with too many rows </span> ");
    myWindowHelp.document.write("<div id=\"src2_forbidden_gradient\" style=\"width:50px; height:40px;\"></div><span>Source with too many rows </span> ");
    myWindowHelp.document.write("<div id=\"src1_forbidden_gradient\" style=\"width:50px; height:40px;\"></div><span>Source with too many rows </span> ");
    myWindowHelp.document.write("<div id=\"dst_forbidden_gradient\" style=\"width:50px; height:40px;\"></div><span>Destination with too many rows</span> ");
    myWindowHelp.document.write("<div id=\"src0_double_gradient\" style=\"width:50px; height:40px;\"></div><span>Source with more then one recall </span> ");
    myWindowHelp.document.write("<div id=\"src2_double_gradient\" style=\"width:50px; height:40px;\"></div><span>Source with more then one recall </span> ");
    myWindowHelp.document.write("<div id=\"src1_double_gradient\" style=\"width:50px; height:40px;\"></div><span>Source with more then one recall </span> ");
    myWindowHelp.document.write("<div id=\"dts_src0_src1_src2_gradient\" style=\"width:50px; height:40px;\"></div><span>Destination and three sources uses the same cell </span> ");
    myWindowHelp.document.write("<div id=\"src_0_src1_src2_gradient\" style=\"width:50px; height:40px;\"></div><span>Three sources uses the same cell </span> ");
    myWindowHelp.document.write("<div id=\"dst_src0_src2_gradient\" style=\"width:50px; height:40px;\"></div><span>Two sources and destination uses the same cell </span> ");
    myWindowHelp.document.write("<div id=\"dst_src1_src2_gradient\" style=\"width:50px; height:40px;\"></div><span>Two sources and destination uses the same cell </span> ");
    myWindowHelp.document.write("<div id=\"dst_src0_src1_gradient\" style=\"width:50px; height:40px;\"></div><span>Two sources and destination uses the same cell </span> ");
    myWindowHelp.document.write("<div id=\"src0_src2_gradient\" style=\"width:50px; height:40px;\"></div><span>Two sources uses the same cell </span> ");
    myWindowHelp.document.write("<div id=\"src2_src1_gradient\" style=\"width:50px; height:40px;\"></div><span>Two sources uses the same cell </span> ");
    myWindowHelp.document.write("<div id=\"src0_src1_gradient\" style=\"width:50px; height:40px;\"></div><span>Two sources uses the same cell </span> ");
    myWindowHelp.document.write("<div id=\"src0_dst_gradient\" style=\"width:50px; height:40px;\"></div><span>Source and destination usese the same cell </span> ");
    myWindowHelp.document.write("<div id=\"src1_dst_gradient\" style=\"width:50px; height:40px;\"></div><span>Source and destination usese the same cell </span> ");
    myWindowHelp.document.write("<div id=\"src2_dst_gradient\" style=\"width:50px; height:40px;\"></div><span>Source and destination usese the same cell </span> ");
    myWindowHelp.document.write("</br><h2>Changelog</h2>");
    myWindowHelp.document.write("<p>11 Oct 2016 - Zebra 1.03 - send decoder working</p>");
    myWindowHelp.document.write("<p>23 Sep 2016 - Zebra 1.02 - visualizer fixes for few situations, changed colors, refactored code </p>");
    myWindowHelp.document.write("<p>9 Sep 2016 - Zebra 1.01 - improved look across browsers, cleaned UI and help</p>");
    myWindowHelp.document.write("<p>1 Sep 2016 - Zebra 1.0</p>");
}
function setEvetList(obj, evt, func) {
    if ('addEventListener' in window) {
        obj.addEventListener(evt, func, false);
    }
    else if ('attachEvent' in window) {
        obj.attachEvent('on' + evt, func);
    }
}
//# sourceMappingURL=setup.js.map