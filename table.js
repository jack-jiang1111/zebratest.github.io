var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var color_source0 = "#3296A3";
var color_source2 = "#7B68EE";
var color_source1 = "#2E86C1";
var color_paleRed = "#CC7E8E";
var color_paleDarkB = "#4F577A";
var color_paleBl = "#8CBDDE";
var color_paleVio = "#6169FA";
var color_dest = "#EB6C63";
var src1_dst_gradient = "src1_dst_gradient";
var src0_dst_gradient = "src0_dst_gradient";
var src2_dst_gradient = "src2_dst_gradient";
var src0_src1_gradient = "src0_src1_gradient";
var src2_src1_gradient = "src2_src1_gradient";
var src0_src2_gradient = "src0_src2_gradient";
var dst_src0_src1_gradient = "dst_src0_src1_gradient";
var dst_src0_src2_gradient = "dst_src0_src2_gradient";
var dst_src1_src2_gradient = "dst_src1_src2_gradient";
var src_0_src1_src2_gradient = "src_0_src1_src2_gradient";
var dts_src0_src1_src2_gradient = "dts_src0_src1_src2_gradient";
var src0_forbidden_gradient = "src0_forbidden_gradient";
var src2_forbidden_gradient = "src2_forbidden_gradient";
var src1_forbidden_gradient = "src1_forbidden_gradient";
var dst_forbidden_gradient = "dst_forbidden_gradient";
var src0_double_gradient = "src0_double_gradient";
var src2_double_gradient = "src2_double_gradient";
var src1_double_gradient = "src1_double_gradient";
var src0_dst_forbid_grad = "src0_dst_forbid_grad";
var src2_dst_forbid_grad = "src2_dst_forbid_grad";
var src1_dst_forbid_grad = "src1_dst_forbid_grad";
var dst_src0_forbid_grad = "dst_src0_forbid_grad";
var src1_src0_forbid_grad = "src1_src0_forbid_grad";
var src2_src0_forbid_grad = "src2_src0_forbid_grad";
var dst_src1_forbid_grad = "dst_src1_forbid_grad";
var src0_src1_forbid_grad = "src0_src1_forbid_grad";
var src2_src1_forbid_grad = "src2_src1_forbid_grad";
var dst_src2_forbid_grad = "dst_src2_forbid_grad";
var src1_src2_forbid_grad = "src1_src2_forbid_grad";
var src0_src2_forbid_grad = "src0_src2_forbid_grad";
var cell_dashedBorder = "cell_dashedBorder";
var cell_dashedBorderRight = "cell_dashedBorderRight";
var cell_dashedBorderLeft = "cell_dashedBorderLeft";
var cell_solidBorderThin = "cell_solidBorderThin";
var cell_headerDashed = "cell_headerDashed";
var cellHeader_LeftBorder = "cellHeader_LeftBorder";
var cellHeader_withoutBorder = "cellHeader_withoutBorder";
var CTable = (function () {
    function CTable(nrRows, nrCollum, Name, ifParalAdd1, typeOf, flagIGC, nrOfFirs, ifFlag1, arrayXYZW) {
        this.m_nrOfCollumns = nrCollum;
        this.m_nrOfRows = nrRows;
        this.m_nrOfFirstRow = nrOfFirs | 0;
        this.m_idTable = Name;
        this.m_addIfParal = ifParalAdd1;
        this.m_paralCellFlag = arrayXYZW;
        this.m_typeOfWord = typeOf;
        this.m_flagRegion = ifFlag1;
        this.m_normalFlag = flagIGC | 0;
        this.m_SetEmptyLineForHR = 1;
    }
    CTable.prototype.addTable = function (flag, arfFlag, FlagFlag) {
        var gran = document.getElementById('granularity');
        var nope = document.createElement('div');
        nope.id = this.m_idTable;
        var trA = document.createElement('tr');
        var tdA = document.createElement('td');
        var tableB = document.createElement('tbody');
        var divTw = document.createElement('div');
        var id = this.m_idTable + this.m_idTable;
        divTw.id = id;
        var tdTw = document.createElement('td');
        var tableAA = document.createElement('table');
        var tableA = document.getElementById('TableTable');
        tableAA.appendChild(tableB);
        tableB.appendChild(trA);
        trA.appendChild(tdA);
        trA.appendChild(tdTw);
        tdA.appendChild(nope);
        tdTw.appendChild(divTw);
        tableA.appendChild(tableAA);
        var ARF;
        var FLAG;
        if (flag == 1) {
            ARF = arfFlag;
            this.m_SetEmptyLineForHR = 0;
        }
        if (flag == 0) {
            FLAG = FlagFlag;
            this.m_SetEmptyLineForHR = 0;
        }
        if (this.m_nrOfFirstRow == -1) {
            this.m_SetEmptyLineForHR = 0;
        }
        var myTable = document.getElementById(this.m_idTable);
        var table = document.createElement('table');
        table.id = "table";
        table.className = "RegTable";
        var tableBody = document.createElement('TBODY');
        table.appendChild(tableBody);
        for (var i = this.m_nrOfFirstRow - this.m_SetEmptyLineForHR; i < (this.m_nrOfFirstRow + this.m_nrOfRows) +
            1 + this.m_addIfParal + this.m_SetEmptyLineForHR; i++) {
            var tr = document.createElement('TR');
            tableBody.appendChild(tr);
            for (var j = this.m_nrOfCollumns; j > -1; j--) {
                var td = document.createElement('TD');
                var div = document.createElement('div');
                td.appendChild(div);
                if (j == 0 &&
                    i != this.m_nrOfFirstRow - this.m_SetEmptyLineForHR &&
                    this.m_addIfParal == 0) {
                    if (FLAG != null) {
                        this.addFlagLabel(i - this.m_nrOfFirstRow - this.m_SetEmptyLineForHR, td);
                    }
                    else if (ARF != null)
                        td.textContent = " " + arfFlag + "+" + (i);
                    else
                        td.textContent = " r" + i;
                    td.id = cellHeader_LeftBorder;
                }
                else if (i != (this.m_nrOfFirstRow + this.m_addIfParal - this.m_SetEmptyLineForHR) &&
                    i != this.m_nrOfFirstRow - this.m_SetEmptyLineForHR &&
                    this.m_addIfParal == 1 &&
                    j == 0) {
                    if (ARF)
                        td.textContent = arfFlag + "+" + (i);
                    else {
                        td.textContent = "r" + (i - 1);
                    }
                    td.id = cellHeader_LeftBorder;
                }
                else if (i == this.m_nrOfFirstRow - this.m_SetEmptyLineForHR &&
                    j != 0) {
                    var numberGran = parseInt(gran.value, 10);
                    var numberOfCol = ((j - 1) / numberGran);
                    var granLabel;
                    if (numberGran == 1) {
                        granLabel = 4;
                    }
                    else
                        granLabel = numberGran;
                    if ((j - 1) % granLabel == 0)
                        td.textContent = "" + numberOfCol;
                    td.id = "tdCol";
                    if (j % 2 == 0)
                        td.id = cell_headerDashed;
                    if (j % 4 == 0)
                        td.style.borderLeft = "2px solid";
                }
                else if (i == this.m_nrOfFirstRow + this.m_addIfParal - this.m_SetEmptyLineForHR &&
                    this.m_addIfParal == 1 &&
                    j != 0) {
                    td.id = "tdCol";
                    if (j % 2 == 0)
                        td.id = cell_headerDashed;
                    if (j % 4 == 0)
                        td.style.borderLeft = "2px solid";
                    var y = j % this.m_typeOfWord;
                    if (j % this.m_typeOfWord != 0 &&
                        j != 32) {
                        td.id = cellHeader_withoutBorder;
                    }
                    if (((j + this.m_typeOfWord - 1) / this.m_typeOfWord) % 4 == 0)
                        td.textContent = "w";
                    if (((j + this.m_typeOfWord - 1) / this.m_typeOfWord) % 4 == 1)
                        td.textContent = "x";
                    if (((j + this.m_typeOfWord - 1) / this.m_typeOfWord) % 4 == 2)
                        td.textContent = "y";
                    if (((j + this.m_typeOfWord - 1) / this.m_typeOfWord) % 4 == 3)
                        td.textContent = "z";
                }
                else if ((i == this.m_nrOfFirstRow - this.m_SetEmptyLineForHR &&
                    j == 0) ||
                    (i == this.m_nrOfFirstRow + this.m_addIfParal - this.m_SetEmptyLineForHR &&
                        j == 0)) {
                }
                else {
                    if (j == 0) {
                        td.id = cell_dashedBorderLeft;
                        td.textContent = "";
                    }
                    else {
                        td.id = cell_dashedBorder;
                        td.textContent = "";
                        if (j % 2 == 0) {
                            td.id = cell_dashedBorderRight;
                        }
                        if (j % 4 == 0)
                            td.style.borderLeft = "2px solid";
                        td.onmouseenter = function () {
                            getVal(this);
                        };
                        td.onmouseleave = function () {
                            retVal(this);
                        };
                    }
                }
                tr.appendChild(td);
            }
        }
        function getVal(cell) {
            var gran = document.getElementById('granularity');
            var n = 32 - cell.cellIndex;
            cell.style.fontSize = "10px";
            cell.textContent = "" + (Round(((n - 1) / parseInt(gran.value, 10)) - 0.5, 0));
        }
        function retVal(cell) {
            cell.textContent = "";
        }
        myTable.appendChild(table);
    };
    CTable.prototype.getFlagTable = function (id, color) {
        var myTable2 = document.getElementById(id);
        var table22 = document.createElement('table');
        var tableBody2 = document.createElement('TBODY');
        table22.appendChild(tableBody2);
        table22.id = "flagTable";
        for (var x = 0; x < 5; x++) {
            var tr2 = document.createElement('TR');
            tableBody2.appendChild(tr2);
            for (var w = 0; w < 9; w++) {
                var td2 = document.createElement('TD');
                var div2 = document.createElement('div');
                td2.appendChild(div2);
                if (w == 0 &&
                    x != 0) {
                    this.addFlagLabel(x, td2);
                    td2.id = cell_dashedBorderLeft;
                }
                else if (this.m_addIfParal == 1 &&
                    x == 0) {
                    if (w == 1 ||
                        w == 5)
                        td2.textContent = "w";
                    if (w == 2
                        || w == 6)
                        td2.textContent = "z";
                    if (w == 3 ||
                        w == 7)
                        td2.textContent = "y";
                    if (w == 4 ||
                        w == 8)
                        td2.textContent = "x";
                    td2.id = cell_solidBorderThin;
                }
                else {
                    if (this.m_normalFlag == 0)
                        this.colorNormalFlag(color, w, x, td2);
                    td2.id = cell_solidBorderThin;
                    td2.textContent = " ";
                }
                tr2.appendChild(td2);
            }
        }
        myTable2.appendChild(table22);
    };
    CTable.prototype.addFlagLabel = function (x, td2) {
        if (x == 1)
            td2.textContent = "f0.0";
        if (x == 2)
            td2.textContent = "f0.1";
        if (x == 3)
            td2.textContent = "f1.0";
        if (x == 4)
            td2.textContent = "f1.1";
    };
    CTable.prototype.colorNormalFlag = function (color, w, x, td2) {
        if (x == this.m_flagRegion) {
            if (this.m_addIfParal < 1) {
                td2.style.backgroundColor = color;
                td2.textContent = " ";
            }
            else {
                for (var q = 0; q < this.m_paralCellFlag.length; q++) {
                    if (w % 4 == this.m_paralCellFlag[q])
                        td2.style.backgroundColor = color;
                    td2.textContent = " ";
                }
            }
        }
    };
    CTable.prototype.deleteText = function (MovNum, flag) {
        var tempT = document.getElementById(this.m_idTable);
        var tempR = tempT.getElementsByTagName('tr');
        for (var i = 1 + flag; i < 1 + this.m_nrOfRows + flag; i++) {
            if (tempR[i]) {
                var tempC = tempR[i].getElementsByTagName('td');
                for (var j = this.m_nrOfCollumns - 1; j > -1; j = j - 1) {
                    tempC[j].textContent = "";
                    tempC[j].onmouseenter = function () {
                        getVal(this);
                    };
                    tempC[j].onmouseleave = function () {
                        retVal(this);
                    };
                }
            }
        }
        function getVal(cell) {
            var granur = document.getElementById('granularity');
            var n = 32 - cell.cellIndex;
            cell.style.fontSize = "10px";
            cell.textContent = "" + (Round(((n - 1) / parseInt(granur.value, 10)) - 0.5, 0));
        }
        function retVal(cell) {
            cell.textContent = "";
        }
    };
    CTable.prototype.colorDestSerial = function (RegNum, SubRegNum, RegFile, Step, Type, movNum) {
        var tempT = document.getElementById(this.m_idTable);
        var tempR = tempT.getElementsByTagName('tr');
        this.m_howManyWordsLeft = RegFile;
        this.m_numberOfWordsInARow = RegFile;
        this.m_countPartOfWord = 0;
        this.m_countStep = 0;
        var Color = color_dest;
        if (SubRegNum * Type > this.m_nrOfCollumns - 1) {
            movNum++;
            SubRegNum = (SubRegNum * Type - this.m_nrOfCollumns) / Type;
            if (i > movNum + 2) {
                Color = color_paleRed;
            }
        }
        for (var i = 1 + this.m_SetEmptyLineForHR + movNum; i < 1 + this.m_SetEmptyLineForHR + this.m_nrOfRows + movNum; i++) {
            if (tempR[i] != null) {
                if (i == 1 + this.m_SetEmptyLineForHR + movNum) {
                    this.Draw(this.m_nrOfCollumns - 1 - SubRegNum * Type, Type, tempR[i], Type, Color, Step, 1, Type, (Step - 1) * Type - Type);
                }
                else {
                    if (i > movNum + 2 + this.m_SetEmptyLineForHR) {
                        Color = color_paleRed;
                    }
                    if (this.m_countPartOfWord != 0) {
                        var temCount = this.m_countPartOfWord;
                        this.m_countPartOfWord = 0;
                        this.Draw(this.m_nrOfCollumns - 1, temCount, tempR[i], temCount, Color, Step, 0, Type, Type * (Step - 1) + Type);
                    }
                    else {
                        var tempStep = this.m_countStep;
                        this.m_countStep = 0;
                        this.Draw(this.m_nrOfCollumns - 1 - tempStep, Type, tempR[i], Type, Color, Step, 1, Type, (Step - 1) * Type - Type);
                    }
                }
            }
        }
    };
    CTable.prototype.colorSourceSerial = function (RegNum, SubRegNum, Width, VertStride, HorizStride, Type, Color, movNum, RegFile) {
        var tempT = document.getElementById(this.m_idTable);
        var tempR = tempT.getElementsByTagName('tr');
        this.m_countStep = 0;
        this.m_howManyWordsLeft = RegFile;
        this.m_countPartOfWord = 0;
        this.m_numberOfWordsInARow = Width;
        var newVertStride = VertStride;
        if (SubRegNum * Type > this.m_nrOfCollumns - 1) {
            movNum++;
            SubRegNum = (SubRegNum * Type - this.m_nrOfCollumns) / Type;
            if (i > movNum + 3) {
                if (Color == color_source1)
                    Color = color_paleBl;
                else if (Color == color_source0)
                    Color = color_paleDarkB;
                else if (Color == color_source2)
                    Color = color_paleVio;
            }
        }
        for (var i = 1 + this.m_SetEmptyLineForHR + movNum; i < 1 + this.m_nrOfRows + movNum + 1 + this.m_SetEmptyLineForHR; i++) {
            if (tempR[i]) {
                if (i == 1 + this.m_SetEmptyLineForHR + movNum) {
                    if (HorizStride != 0)
                        this.Draw(this.m_nrOfCollumns - Type * SubRegNum - 1, Type, tempR[i], Type, Color, HorizStride, 1, 0, 0);
                    else {
                        this.Draw(this.m_nrOfCollumns - Type * SubRegNum - 1, Type, tempR[i], 0, Color, HorizStride, 1, 0, 0);
                    }
                    if (VertStride == 0) {
                        this.m_howManyWordsLeft = 0;
                    }
                    var count = 1;
                    if (VertStride != 0) {
                        while (VertStride * Type * count < this.m_nrOfCollumns) {
                            count++;
                            if (VertStride * Type < this.m_nrOfCollumns &&
                                HorizStride != 0) {
                                this.m_numberOfWordsInARow = Width;
                                this.Draw(this.m_nrOfCollumns - Type * SubRegNum - 1 - VertStride * Type * (count - 1), Type, tempR[i], Type, Color, HorizStride, 1, 0, 0);
                            }
                            if (VertStride * Type < this.m_nrOfCollumns &&
                                HorizStride == 0) {
                                this.m_numberOfWordsInARow = Width;
                                this.Draw(this.m_nrOfCollumns - Type * SubRegNum - 1 - VertStride * Type * (count - 1), Type, tempR[i], 0, Color, HorizStride, 1, 0, 0);
                            }
                        }
                    }
                }
                else {
                    if (i > movNum + 2 + this.m_SetEmptyLineForHR) {
                        if (Color == color_source1)
                            Color = color_paleBl;
                        else if (Color == color_source0)
                            Color = color_paleDarkB;
                        else if (Color == color_source2)
                            Color = color_paleVio;
                    }
                    if (this.m_howManyWordsLeft > 0) {
                        var wordsMov = this.m_numberOfWordsInARow;
                        if (this.m_numberOfWordsInARow > 0) {
                            this.Draw(this.m_nrOfCollumns - 1 - this.m_countStep, Type, tempR[i], Type, Color, HorizStride, 0);
                            this.m_countStep = 0;
                        }
                        this.m_numberOfWordsInARow = Width;
                        var moveEnoughWords = 0;
                        var stepHorz = HorizStride;
                        if (HorizStride < 2) {
                            stepHorz = 0;
                        }
                        if (VertStride > (this.m_nrOfCollumns / Type - SubRegNum) &&
                            VertStride < 2 * this.m_nrOfCollumns / Type - SubRegNum) {
                            moveEnoughWords = (VertStride - (this.m_nrOfCollumns / Type - SubRegNum)) * Type;
                        }
                        else if (VertStride > (this.m_nrOfCollumns / Type - SubRegNum) &&
                            VertStride > 2 * this.m_nrOfCollumns / Type - SubRegNum) {
                            newVertStride = newVertStride - (this.m_nrOfCollumns / Type - SubRegNum);
                            moveEnoughWords = this.m_nrOfCollumns;
                        }
                        else if (VertStride < (this.m_nrOfCollumns / Type - SubRegNum)) {
                            moveEnoughWords = wordsMov * Type;
                        }
                        if (HorizStride == 0) {
                            this.Draw(this.m_nrOfCollumns - 1 - moveEnoughWords - this.m_countStep, Type, tempR[i], 0, Color, HorizStride, 1, 0, 0);
                        }
                        else {
                            this.Draw(this.m_nrOfCollumns - 1 - moveEnoughWords - this.m_countStep, Type, tempR[i], Type, Color, HorizStride, 1, 0, 0);
                        }
                        var count = 1;
                        if (VertStride != 0) {
                            while (VertStride * Type * count < this.m_nrOfCollumns) {
                                count++;
                                if (VertStride * Type < this.m_nrOfCollumns &&
                                    HorizStride != 0) {
                                    this.m_numberOfWordsInARow = Width;
                                    this.Draw(this.m_nrOfCollumns - 1 - moveEnoughWords - this.m_countStep - VertStride * Type * (count - 1), Type, tempR[i], Type, Color, HorizStride, 1, 0, 0);
                                }
                                if (VertStride * Type < this.m_nrOfCollumns &&
                                    HorizStride == 0) {
                                    this.m_numberOfWordsInARow = Width;
                                    this.Draw(this.m_nrOfCollumns - 1 - moveEnoughWords - this.m_countStep - VertStride * Type * (count - 1), Type, tempR[i], 0, Color, HorizStride, 1, 0, 0);
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    CTable.prototype.colorCellGradient = function (tempC, Color) {
        var t = tempC.bgColor;
        if (tempC.id == src1_dst_gradient &&
            Color == color_source0) {
            tempC.id = dst_src0_src1_gradient;
        }
        else if (tempC.id == dst_src0_src1_gradient &&
            Color == color_source2) {
            tempC.id = dts_src0_src1_src2_gradient;
        }
        else if (tempC.id == src1_dst_gradient &&
            Color == color_source1) {
            tempC.id = src1_dst_gradient;
        }
        else if (tempC.id == src1_dst_gradient &&
            Color == color_source2) {
            tempC.id = dst_src1_src2_gradient;
        }
        else if (tempC.id == src0_dst_gradient &&
            Color == color_source0) {
            tempC.id = src0_dst_gradient;
        }
        else if (tempC.id == src0_dst_gradient &&
            Color == color_source2) {
            tempC.id = dst_src0_src2_gradient;
        }
        else if (tempC.id == src0_src1_gradient &&
            Color == color_source2) {
            tempC.id = src_0_src1_src2_gradient;
        }
        else if (tempC.id == src0_dst_gradient &&
            Color == color_source1) {
            tempC.id = dst_src0_src1_gradient;
        }
        else if (tempC.textContent.localeCompare(color_dest) == 0
            && Color == color_source0) {
            tempC.id = src0_dst_gradient;
        }
        else if (tempC.textContent.localeCompare(color_source1) == 0
            && Color == color_source0) {
            tempC.id = src0_src1_gradient;
        }
        else if (tempC.textContent.localeCompare(color_source0) == 0
            && Color == color_source1) {
            tempC.id = src0_src1_gradient;
        }
        else if (tempC.textContent.localeCompare(color_source1) == 0
            && Color == color_source2) {
            tempC.id = src2_src1_gradient;
        }
        else if (tempC.textContent.localeCompare(color_source0) == 0
            && Color == color_source2) {
            tempC.id = src0_src2_gradient;
        }
        else if (tempC.textContent.localeCompare(color_paleDarkB) == 0
            && Color == color_paleBl) {
            tempC.id = src0_src1_gradient;
        }
        else if (tempC.textContent.localeCompare(color_source0) == 0
            && Color == color_paleBl) {
            tempC.id = src0_src1_gradient;
        }
        else if (tempC.textContent.localeCompare(color_paleDarkB) == 0
            && Color == color_source1) {
            tempC.id = src0_src1_gradient;
        }
        else if (tempC.textContent.localeCompare(color_source1) == 0
            && Color == color_paleVio) {
            tempC.id = src2_src1_gradient;
        }
        else if (tempC.textContent.localeCompare(color_paleBl) == 0
            && Color == color_paleVio) {
            tempC.id = src2_src1_gradient;
        }
        else if (tempC.textContent.localeCompare(color_paleBl) == 0
            && Color == color_source2) {
            tempC.id = src2_src1_gradient;
        }
        else if (tempC.textContent.localeCompare(color_source0) == 0
            && Color == color_paleVio) {
            tempC.id = src0_src2_gradient;
        }
        else if (tempC.textContent.localeCompare(color_paleDarkB) == 0
            && Color == color_source2) {
            tempC.id = src0_src2_gradient;
        }
        else if (tempC.textContent.localeCompare(color_paleDarkB) == 0
            && Color == color_source2) {
            tempC.id = src0_src2_gradient;
        }
        else if (tempC.style.backgroundColor.localeCompare(color_dest) == 0
            && Color == color_source0) {
            tempC.id = src0_dst_gradient;
        }
        else if (tempC.style.backgroundColor.localeCompare(color_dest) == 0
            && Color == color_source2) {
            tempC.id = src2_dst_gradient;
        }
        else if (tempC.style.backgroundColor.localeCompare(color_dest) == 0
            && Color == color_source1) {
            tempC.id = src1_dst_gradient;
        }
        else if (tempC.style.backgroundColor.localeCompare(color_dest) == 0
            && Color == color_paleBl) {
            tempC.id = src1_dst_gradient;
        }
        else if (tempC.style.backgroundColor.localeCompare(color_dest) == 0
            && Color == color_paleDarkB) {
            tempC.id = src0_dst_gradient;
        }
        else if (tempC.style.backgroundColor.localeCompare(color_dest) == 0
            && Color == color_paleVio) {
            tempC.id = src2_dst_gradient;
        }
        else if (tempC.textContent.localeCompare(color_source1) == 0 &&
            Color == color_source1) {
            tempC.id = src1_double_gradient;
        }
        else if (tempC.textContent.localeCompare(color_source0) == 0 &&
            Color == color_source0) {
            tempC.id = src0_double_gradient;
        }
        else if (tempC.textContent.localeCompare(color_source2) == 0 &&
            Color == color_source2) {
            tempC.id = src2_double_gradient;
        }
        else if (Color == color_paleDarkB) {
            tempC.id = src0_forbidden_gradient;
        }
        else if (Color == color_paleBl) {
            tempC.id = src1_forbidden_gradient;
        }
        else if (Color == color_paleRed) {
            tempC.id = dst_forbidden_gradient;
        }
        else if (Color == color_paleVio) {
            tempC.id = src2_forbidden_gradient;
        }
        else if (tempC.id == dst_forbidden_gradient &&
            Color == color_source1) {
            tempC.id = src1_dst_forbid_grad;
        }
        else if (tempC.id == dst_forbidden_gradient &&
            Color == color_source0) {
            tempC.id = src0_dst_forbid_grad;
        }
        else if (tempC.id == dst_forbidden_gradient &&
            Color == color_source2) {
            tempC.id = src2_dst_forbid_grad;
        }
        else if (tempC.id == src0_forbidden_gradient &&
            Color == color_dest) {
            tempC.id = dst_src0_forbid_grad;
        }
        else if (tempC.id == src0_forbidden_gradient &&
            Color == color_source1) {
            tempC.id = src1_src0_forbid_grad;
        }
        else if (tempC.id == src0_forbidden_gradient &&
            Color == color_source2) {
            tempC.id = src2_src0_forbid_grad;
        }
        else if (tempC.id == src1_forbidden_gradient &&
            Color == color_dest) {
            tempC.id = dst_src1_forbid_grad;
        }
        else if (tempC.id == src1_forbidden_gradient &&
            Color == color_source0) {
            tempC.id = src0_src1_forbid_grad;
        }
        else if (tempC.id == src1_forbidden_gradient &&
            Color == color_source2) {
            tempC.id = src2_src1_forbid_grad;
        }
        else if (tempC.id == src2_forbidden_gradient &&
            Color == color_dest) {
            tempC.id = dst_src2_forbid_grad;
        }
        else if (tempC.id == src2_forbidden_gradient &&
            Color == color_source1) {
            tempC.id = src1_src2_forbid_grad;
        }
        else if (tempC.id == src2_forbidden_gradient &&
            Color == color_source0) {
            tempC.id = src0_src2_forbid_grad;
        }
        else {
            tempC.style.backgroundColor = Color;
            tempC.textContent = Color;
            tempC.style.color = "black";
            tempC.style.fontSize = "1px";
        }
    };
    CTable.prototype.Draw = function (StartUp, RepeatNum, tempR, Step, Color, stepFlag, countFlag, newRepeatNum, NewStep) {
        var tempC = tempR.getElementsByTagName('td');
        for (var j = StartUp; j > -1; j = j - Step) {
            this.m_countStep = 0;
            if (this.m_howManyWordsLeft < 1 || this.m_numberOfWordsInARow < 1) {
                j = -1;
                break;
            }
            for (var k = 0; k < RepeatNum; k++) {
                if (tempC[j - k] == null) {
                    this.m_countPartOfWord++;
                }
                else {
                    var borderColor = "#565";
                    this.colorCellGradient(tempC[j - k], Color);
                    tempC[j - k].style.color = "white";
                    tempC[j - k].style.borderBottom = "4px solid " + borderColor;
                    tempC[j - k].style.borderTop = "4px solid " + borderColor;
                    if (k == 0)
                        tempC[j - k].style.borderRight = "4px solid " + borderColor;
                    if (k == RepeatNum - 1)
                        tempC[j - k].style.borderLeft = "4px solid " + borderColor;
                }
            }
            if (this.m_countPartOfWord == 0) {
                this.m_howManyWordsLeft--;
                this.m_numberOfWordsInARow--;
            }
            if (stepFlag > 1) {
                if (j == StartUp) {
                    var stepTemp = Step;
                    Step = stepFlag * Step;
                }
                for (var k = RepeatNum; k < RepeatNum + Step - stepTemp; k++) {
                    if (tempC[j - k] == null) {
                        this.m_countStep++;
                    }
                }
            }
        }
    };
    return CTable;
})();
function Round(n, k) {
    var factor = Math.pow(10, k);
    return Math.round(n * factor) / factor;
}
function getTableName(i) {
    return "myTable" + i;
}
var CTableForParall = (function (_super) {
    __extends(CTableForParall, _super);
    function CTableForParall() {
        _super.apply(this, arguments);
    }
    CTableForParall.prototype.colorDestin = function (RegNum, SubRegNum, Type, DestCells, MovNum) {
        var tempT = document.getElementById(this.m_idTable);
        var howManyCells = DestCells.length * Type * 2;
        this.DrawPara(Type * SubRegNum, MovNum + this.m_SetEmptyLineForHR, DestCells.length, DestCells, Type, tempT, howManyCells, color_dest);
    };
    CTableForParall.prototype.colorSource = function (RegNum, SubRegNum, Type, Width, DestCells, SourceCells, Color, MovNum) {
        var tempT = document.getElementById(this.m_idTable);
        var howManyCells;
        var length = DestCells.length;
        for (var t = 1; t < DestCells.length; t++) {
            if (DestCells[t] == DestCells[t - 1]) {
                length = t;
                break;
            }
        }
        if (Width < 4)
            howManyCells = length * Type;
        else {
            howManyCells = length * Type * 2;
        }
        if (SourceCells.length < DestCells.length) {
            for (var i = SourceCells.length; i > (DestCells.length - SourceCells.length); i++) {
                SourceCells[i] = SourceCells[SourceCells.length - 1];
            }
        }
        this.DrawPara(Type * SubRegNum, MovNum + this.m_SetEmptyLineForHR, length, SourceCells, Type, tempT, howManyCells, Color);
        var tempR = tempT.getElementsByTagName('tr');
    };
    CTableForParall.prototype.DrawPara = function (SubReg, MovNum, lenghtOfDest, Cells, Type, tempT, howManyCells, Color) {
        var tempR = tempT.getElementsByTagName('tr');
        for (var i = 2 + MovNum; i < 2 + this.m_SetEmptyLineForHR + this.m_nrOfRows + MovNum; i++) {
            if (tempR[i]) {
                var tempC = tempR[i].getElementsByTagName('td');
                for (var j = tempC.length - 2 - SubReg; j > -1; j = j - Type * 4) {
                    if (howManyCells < 1) {
                        j = -1;
                        break;
                    }
                    for (var k = 0; k < lenghtOfDest; k++) {
                        for (var l = 0; l < Type; l++) {
                            var temp = j - Cells[k] * Type - l;
                            if (tempC[temp]) {
                                this.colorCellGradient(tempC[temp], Color);
                                tempC[temp].style.borderBottom = "3px solid";
                                tempC[temp].style.borderTop = "3px solid";
                                if (l == 0) {
                                    tempC[temp].style.borderRight = "3px solid";
                                }
                                if (l == Type - 1)
                                    tempC[temp].style.borderLeft = "3px solid";
                            }
                            howManyCells--;
                        }
                    }
                }
            }
        }
    };
    return CTableForParall;
})(CTable);
