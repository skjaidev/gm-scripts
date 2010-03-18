/* This greasemonkey script adds 'Unlabelled' at the end of the labels list 
 * to search for unlabelled conversations
 *
 * Author: Jaidev K Sridhar mail<AT>jaidev<DOT>info
 *
 * Copyright (c) 2005-2010, Jaidev K Sridhar
 * Released under the GPL license
 * http://www.gnu.org/copyleft/gpl.html
 */

// ==UserScript==
// @name      Gmail Unlabelled 2.0
// @namespace   http://jaidev.info/home/hacks/gmailUnlabelled
// @description   This script adds 'Unlabelled' at the end of the labels list to search for unlabelled conversations. This version is for the "new" version of gmail (Nov 2007).
// @include     http*://mail.google.com/*
// ==/UserScript==
// Control parameters -- tweak in about:config
// logging = 0-3 : Set log level (0-Disable, 1-Errors, 2-Warnings, 3-Verbose)
var gmail = null;
var logging = 0;
var L_ERR = 1;
var L_WAR = 2;
var L_VER = 3;

var MMC = "LrBjie";
var LC = "n0"
var SID = ":rc";
var exclude = new Array (
  "Inbox",
  "Buzz",
  "Chats",
  "Sent Mail",
  "Drafts",
  "All Mail",
  "Starred",
  "Spam",
  "Trash"
);
function doLog (level, logmsg) {
  if (logging == 0) {
    logging = GM_getValue ('logging');
    if (logging == undefined) {
      logging = 1;
      GM_setValue ('logging', logging);
    }
  }
  if (logging >= level) {
    var d = new Date();
    GM_log ("<" + level + ">[" + d.toLocaleTimeString() + "] " + logmsg);
  }
}
function gmailUnlabelled () {
  try {
    var root = gmail.getFooterElement ().ownerDocument;
    if (!root.getElementById ("label_none")) {
      var expr = ".//div[contains (concat (' ', @class, ' '), ' " + MMC 
          + " ')]";
      var menu_div = root.evaluate (expr, root, null, 
          XPathResult.ORDERED_NODE_ITERATOR_TYPE, null).iterateNext ();
      var label_none = menu_div.firstChild.lastChild.cloneNode (true);
      var lna = label_none.firstChild.lastChild.firstChild;
      lna.setAttribute ("id", "label_none");
      lna.innerHTML = "<b>Unlabelled</b>";
      lna.href = "";
      lna.addEventListener ("click", function (event) {
        event.stopPropagation ();
        event.preventDefault ();
        var lexpr = ".//a[contains (concat (' ', @class, ' '), ' " + LC 
            + " ')]";
        var res = root.evaluate (lexpr, root, null, 
            XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
        var QS = "";
        var lname = "";
        var excludes = ":" + exclude.join (":") + ":";
        if (res) {
          while (labs = res.iterateNext ()) {
            lname = labs.getAttribute ('title');
            if (excludes.indexOf (":" + lname + ":") == -1) {
              QS = QS + ' -label:' + 
                  lname.replace (/[/\ &]/g, '-').replace(/-\(\d+\)$/, "");
            }
          }
        }
        var srch_ip = this.ownerDocument.getElementById (SID);
        srch_ip.value = QS;
        srch_ip.focus ();
        var evt = srch_ip.ownerDocument.createEvent ("KeyboardEvent");
        evt.initKeyEvent ("keypress", true, false, null,
            false, false, false, false, 0x0D, 0);
        srch_ip.dispatchEvent (evt);
      }, true);
      menu_div.firstChild.insertBefore (label_none, null);
      var srch_ip = root.getElementById (SID);
      srch_ip.addEventListener ("keypress", function (event) {
        if (event.keyCode == 0x0D && event.charCode == 0 && 
            "-label" == this.value) { 
          var lexpr = ".//a[contains (concat (' ', @class, ' '), ' " + LC 
              + " ')]";
          var res = root.evaluate (lexpr, root, null, 
              XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
          var QS = "";
          var lname = "";
          var excludes = ":" + exclude.join (":") + ":";
          if (res) {
            while (labs = res.iterateNext ()) {
              lname = labs.getAttribute ('title');
              if (excludes.indexOf (":" + lname + ":") == -1) {
                QS = QS + ' -label:' + 
                    lname.replace (/[/\ &]/g, '-').replace(/-\(\d+\)$/, "");
              }
            }
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
          var lexpr = ".//a[contains (concat (' ', @class, ' '), ' " + LC 
              + " ')]";
          var res = root.evaluate (lexpr, root, null, 
              XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
          var QS = "";
          var lname = "";
          var excludes = ":" + exclude.join (":") + ":";
          if (res) {
            while (labs = res.iterateNext ()) {
              lname = labs.getAttribute ('title');
              if (excludes.indexOf (":" + lname + ":") == -1) {
                QS = QS + ' -label:' + 
                    lname.replace (/[/\ &]/g, '-').replace(/-\(\d+\)$/, "");
              }
            }
          }
          this.value = QS;
          var evt = this.ownerDocument.createEvent ("KeyboardEvent");
          evt.initKeyEvent ("keypress", true, false, null,
              false, false, false, false, 0x0D, 0);
          this.dispatchEvent (evt);
        }
      }, true);
      doLog (L_VER, "Script initialized");
    }
  }
  catch (ex) {
    GM_log ("gmailUnlabelled: Exception '" + ex.message + "'. Retry in 250ms.");
    window.setTimeout (gmailUnlabelled, 250);
  }
}
function gmailUnlabelledInit (g) 
{
  gmail = g;
  window.setTimeout (gmailUnlabelled, 750);
  gmail.registerViewChangeCallback (gmailUnlabelled);
}
function scriptStart () 
{
  window.addEventListener ('load', function () {
    if (unsafeWindow.gmonkey) {
      unsafeWindow.gmonkey.load ("1.0", gmailUnlabelledInit);
    }
    else {
      GM_log ("gmailUnlabelled: Waiting for gmail API, retrying in 250ms.");
      window.setTimeout (scriptStart, 250);
    }
  }, true);
}
window.setTimeout (scriptStart, 500);

