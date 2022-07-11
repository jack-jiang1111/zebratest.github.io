/// <reference path="jquery.d.ts" />
///<reference path="setup.ts"/>
/*****************************************************************************\
 
Copyright 2000-2011 Intel Corporation All Rights Reserved. Intel Confidential.
 
The source code contained or described herein and all documents related to
the source code ("Material") are owned by Intel Corporation or its suppliers
or licensors. Title to the Material remains with Intel Corporation or its
suppliers and licensors. The Material contains trade secrets and proprietary
and confidential information of Intel or its suppliers and licensors.
The Material is protected by worldwide copyright and trade secret laws and
treaty provisions. No part of the Material may be used, copied, reproduced,
modified, published, uploaded, posted, transmitted, distributed, or disclosed
in any way without Intel’s prior express written permission.
 
No license under any patent, copyright, trade secret or other intellectual
property right is granted to or conferred upon you by disclosure or delivery
of the Materials, either expressly, by implication, inducement, estoppel
or otherwise. Any license under such intellectual property rights must be
express and approved by Intel in writing.
 
File Name:  Zebra.ts
 
Abstract:   regioning visualizer tool, you add an assembler command into the
            text field on web page and it shows which regions are used
 
Notes:
 
\*****************************************************************************/
var myWindowError;
var count = 1;
// Adds indexOf function to Array object
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (obj, start) {
        for (var i = (start || 0), j = this.length; i < j; i++) {
            if (this[i] === obj) {
                return i;
            }
        }
        return -1;
    };
}
// This is workaround for browser incompatibilities.
if (Object.defineProperty && Object.getOwnPropertyDescriptor &&
    Object.getOwnPropertyDescriptor(Element.prototype, "textContent") &&
    !Object.getOwnPropertyDescriptor(Element.prototype, "textContent").get)
    (function () {
        var innerText = Object.getOwnPropertyDescriptor(Element.prototype, "innerText");
        Object.defineProperty(Element.prototype, "textContent", {
            // and innerText.set or the whole descriptor.
            get: function () {
                return innerText.get.call(this);
            },
            set: function (x) {
                return innerText.set.call(this, x);
            }
        });
    })();
window.onload = function () {
    function addEventListener(obj, evt, func) {
        if ('addEventListener' in window) {
            obj.addEventListener(evt, func, false);
        }
        else if ('attachEvent' in window) {
            obj.attachEvent('on' + evt, func);
        }
    }
    $('textarea#textA').keydown(function (e) {
        if (e.keyCode === 13 && e.ctrlKey) {
            VisualizeClick(document.getElementById('textA'));
        }
    }).keypress(function (e) {
        if (e.keyCode === 13 && e.ctrlKey) {
            VisualizeClick(document.getElementById('textA'));
        }
    });
    setEvetList(document.getElementById("Visualise"), 'click', VisualizeClick);
    setEvetList(document.getElementById("Clean"), 'click', DeleteArea);
    setEvetList(document.getElementById("Info_List"), 'click', GetErrorList);
    setEvetList(document.getElementById("Help"), 'click', GetHelp);
    setEvetList(document.getElementById("Example"),'click',ShowExample);
};
//# sourceMappingURL=zebra.js.map