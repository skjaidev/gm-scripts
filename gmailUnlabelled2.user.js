/* This greasemonkey script adds 'Unlabelled' at the end of the labels list 
 * to search for unlabelled conversations
 *
 * Author: Jaidev K Sridhar mail<AT>jaidev<DOT>info
 *
 * Copyright (c) 2005-2008, Jaidev K Sridhar
 * Released under the GPL license
 * http://www.gnu.org/copyleft/gpl.html
 */

// ==UserScript==
// @name      Gmail Unlabelled 2.0
// @namespace   http://jaidev.info/home/hacks/gmailUnlabelled
// @description   This script adds 'Unlabelled' at the end of the labels list to search for unlabelled conversations. This version is for the "new" version of gmail (Nov 2007).
// @include     http*://mail.google.com/*
// ==/UserScript==
var gmail = null;
var HDL = ":r6"; 
var SBR = ":r8";
var SIC = "ZRiJh mFwySd";
var SID = ":rc";
function gmailUnlabelled () {
  var root = gmail.getFooterElement ().ownerDocument;
  if (!root.getElementById ("label_none")) {
    var sbr = root.getElementById (SBR);
    if (null == sbr) return;
    var tbody = sbr.firstChild.nextSibling.nextSibling.firstChild.firstChild;
    var label_none = tbody.lastChild.cloneNode (true);
    var lna = label_none.lastChild.firstChild.firstChild.firstChild;
    lna.setAttribute ("id", "label_none");
    lna.innerHTML = "<b>Unlabelled</b>";
    lna.href = "";
    lna.setAttribute ("title", "Find Unlabelled Messages");
    lna.addEventListener ("click", function (event) {
      event.stopPropagation ();
      event.preventDefault ();
      var sbr = this.ownerDocument.getElementById (SBR);
      var tr = sbr.lastChild.firstChild.firstChild.firstChild;
      var QS = "";
      var l = "";
      while (tr) {
        l = tr.lastChild.firstChild.firstChild.firstChild.getAttribute ('title');
        QS = QS + ' -label:' + l.replace (/[/\ &]/g, '-').replace(/-\(\d+\)$/, "");
        tr = tr.nextSibling;
      }
      var tab_div = this.ownerDocument.getElementById (HDL).firstChild.nextSibling.nextSibling;
      tr = tab_div.firstChild.firstChild.firstChild;
      while (tr) {
        l = tr.lastChild.firstChild.firstChild.firstChild.getAttribute ('title');
        QS = QS + ' -label:' + l.replace (/[/\ &]/g, '-').replace(/-\(\d+\)$/, "");
        tr = tr.nextSibling;
      }
      var srch_ip = this.ownerDocument.getElementById (SID);
      srch_ip.value = QS;
      srch_ip.focus ();
      var evt = srch_ip.ownerDocument.createEvent ("KeyboardEvent");
      evt.initKeyEvent ("keypress", true, false, null,
          false, false, false, false, 0x0D, 0);
      srch_ip.dispatchEvent (evt);
    }, true);
    tbody.insertBefore (label_none, tbody.lastChild.nextSibling);
    var srch_ip = root.getElementById (SID);
    srch_ip.addEventListener ("keypress", function (event) {
      if (event.keyCode == 0x0D && event.charCode == 0 && 
          "-label" == this.value) { 
        var sbr = this.ownerDocument.getElementById (SBR);
        var tr = sbr.lastChild.firstChild.firstChild.firstChild;
        var QS = "";
        var l = "";
        while (tr) {
          l = tr.lastChild.firstChild.firstChild.firstChild.getAttribute ('title');
          QS = QS + ' -label:' + l.replace (/[/\ &]/g, '-').replace(/-\(\d+\)$/, "");
          tr = tr.nextSibling;
        }
        var tab_div = this.ownerDocument.getElementById (HDL).firstChild.nextSibling.nextSibling;
        tr = tab_div.firstChild.firstChild.firstChild;
        while (tr) {
          l = tr.lastChild.firstChild.firstChild.firstChild.getAttribute ('title');
          QS = QS + ' -label:' + l.replace (/[/\ &]/g, '-').replace(/-\(\d+\)$/, "");
          tr = tr.nextSibling;
        }
        this.value = QS;
        this.focus ();
        var evt = this.ownerDocument.createEvent ("KeyboardEvent");
        evt.initKeyEvent ("keypress", true, false, null,
            false, false, false, false, 0x0D, 0);
        this.dispatchEvent (evt);
      }
    }, true);
    srch_ip.addEventListener ("change", function (event) {
      if ("-label" == this.value) { 
        var sbr = this.ownerDocument.getElementById (SBR);
        var tr = sbr.lastChild.firstChild.firstChild.firstChild;
        var QS = "";
        var l = "";
        while (tr) {
          l = tr.lastChild.firstChild.firstChild.firstChild.getAttribute ('title');
          QS = QS + ' -label:' + l.replace (/[/\ &]/g, '-').replace(/-\(\d+\)$/, "");
          tr = tr.nextSibling;
        }
        var tab_div = this.ownerDocument.getElementById (HDL).firstChild.nextSibling.nextSibling;
        tr = tab_div.firstChild.firstChild.firstChild;
        while (tr) {
          l = tr.lastChild.firstChild.firstChild.firstChild.getAttribute ('title');
          QS = QS + ' -label:' + l.replace (/[/\ &]/g, '-').replace(/-\(\d+\)$/, "");
          tr = tr.nextSibling;
        }
        this.value = QS;
        var evt = this.ownerDocument.createEvent ("KeyboardEvent");
        evt.initKeyEvent ("keypress", true, false, null,
            false, false, false, false, 0x0D, 0);
        this.dispatchEvent (evt);
      }
    }, true);
  }
}
function gmailUnlabelledInit (g) 
{
  gmail = g;
  window.setTimeout (gmailUnlabelled, 250);
  gmail.registerViewChangeCallback (gmailUnlabelled);
}
function scriptStart () 
{
  window.addEventListener ('load', function () {
    if (unsafeWindow.gmonkey) {
      unsafeWindow.gmonkey.load ("1.0", gmailUnlabelledInit);
    }
    else {
      window.setTimeout (scriptStart, 250);
    }
  }, true);
}
window.setTimeout (scriptStart, 500);

