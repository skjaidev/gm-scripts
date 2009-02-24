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
var LDC = "pvSW6e";
var SIC = "ZRiJh mFwySd";
var SID = ":ra";
window.addEventListener ('load', function () {
  if (unsafeWindow.gmonkey) {
    unsafeWindow.gmonkey.load ("1.0", function (gmail) {
      function gmailUnlabelled () {
        var root = gmail.getNavPaneElement ().ownerDocument;
        if (!root.getElementById ("label_none")) {
          var expr = ".//div[contains (concat (' ', @class, ' '), ' " + LDC 
              + " ')]";
          var tab_div = root.evaluate (expr, root, null, 
              XPathResult.ORDERED_NODE_ITERATOR_TYPE, null).iterateNext ();
          tab_div.setAttribute ("id", "lb_tbl_div");
          var label_none = tab_div.nextSibling.cloneNode (true);
          label_none.setAttribute ("id", "label_none");
          label_none.innerHTML = "Unlabelled";
          label_none.addEventListener ("click", function (event) {
            event.cancelBubble = true;
            var tab_div = this.ownerDocument.getElementById ("lb_tbl_div");
            var tr = tab_div.firstChild.firstChild.firstChild;
            var QS = "";
            var l = "";
            while (tr) {
              l = tr.firstChild.firstChild.firstChild.firstChild.innerHTML;
              QS = QS + ' -label:' + l.replace (/[/\ &]/g, '-');
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
          tab_div.parentNode.insertBefore (label_none, tab_div.nextSibling);
          var srch_ip = root.getElementById (SID);
          srch_ip.addEventListener ("keypress", function (event) {
            if (event.keyCode == 0x0D && event.charCode == 0 && 
                "-label" == this.value) { 
              var tab_div = this.ownerDocument.getElementById ("lb_tbl_div");
              var tr = tab_div.firstChild.firstChild.firstChild;
              var QS = "";
              var l = "";
              while (tr) {
                l = tr.firstChild.firstChild.firstChild.firstChild.innerHTML;
                QS = QS + ' -label:' + l.replace (/[/\ &]/g, '-');
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
              var tab_div = this.ownerDocument.getElementById ("lb_tbl_div");
              var tr = tab_div.firstChild.firstChild.firstChild;
              var QS = "";
              var l = "";
              while (tr) {
                l = tr.firstChild.firstChild.firstChild.firstChild.innerHTML;
                QS = QS + ' -label:' + l.replace (/[/\ &]/g, '-');
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
      window.setTimeout (gmailUnlabelled, 500);
      gmail.registerViewChangeCallback (gmailUnlabelled);
    });
  }
}, true);


