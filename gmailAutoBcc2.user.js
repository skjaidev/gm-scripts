/* This greasemonkey script automatically BCCs (or CCs) outgoing email from 
 * a gmail address to a specified email address
 * 
 * Author: Jaidev K Sridhar mail<AT>jaidev<DOT>info
 * 
 * Copyright (c) 2005-2010, Jaidev K Sridhar
 * Released under the GPL license
 * http://www.gnu.org/copyleft/gpl.html
 */

// ==UserScript==
// @name        Gmail Auto BCC
// @namespace   http://jaidev.info/home/projects/gmailAutoBcc
// @description This greasemonkey script automatically BCCs (or CCs) outgoing email from a gmail address to a specified email address. This version is for the "new" version of gmail (Nov 2007).
// @include     http*://mail.google.com/mail/*
// @include     http*://mail.google.com/a/*
// ==/UserScript==

// Control parameters -- tweak in about:config
// gBccMail = email Address : Email address to BCC to
// gBccEnabled = true / false
// gBccPopup = true / false : Pops up a confirmation prompt before adding BCC
// gBccHeader = "bcc" : Header to add. By default BCC. Can be set to "cc".
// gBccMapFromAddress = true / false : Use different addresses for different
//                                     identities or different gmail accounts
// gBccLogging = 0-3 : Set log level (0-Disable, 1-Errors, 2-Warnings, 3-Verbose)
var gmail = null;
var logging = 0;
var L_ERR = 1;
var L_WAR = 2;
var L_VER = 3;

var TOCLS = "dK nr";
var REBTN = "J-K-I J-J5-Ji J-K-I-Js-KK GZ L3";
var RABTN = "b7 J-M";

function gBccLog (level, logmsg) {
  if (logging == 0) {
    logging = GM_getValue ('gBccLogging');
    if (logging == undefined) {
      logging = 1;
      GM_setValue ('gBccLogging', logging);
    }
  }
  if (logging >= level) {
    var d = new Date();
    GM_log ("<" + level + ">[" + d.toLocaleTimeString() + "] " + logmsg);
  }
}

function addBcc (tgt) {
  var enabled = GM_getValue('gBccEnabled');
  if (enabled == false) {
    gBccLog (L_VER, "Script disabled");
    return;
  }
  else if (enabled != true) {
    /* We're probably running for the first time */
    GM_setValue('gBccEnabled', true);
    GM_setValue('gBccPopup', false); // FALSE by default
    GM_setValue('gBccMapFromAddress', false); // FALSE by default
    enabled = true;
  }
  var form;
  var forms = tgt.ownerDocument.getElementsByTagName ('form');
  //alert (forms.length);
  for (var i = 0; i < forms.length; i++) {
    if (forms[i].elements.namedItem ('bcc')) {
      form = forms[i];
      break;
    }
  }
  //if (tgt.form) {
  //  form = tgt.form;
  //}
  //else {
  //  if (tgt.getAttribute ('class') == REBTN) {
  //    form = tgt.parentNode.parentNode.nextSibling.firstChild.firstChild.firstChild.nextSibling.lastChild.firstChild.lastChild.firstChild.firstChild.firstChild.nextSibling.firstChild;
  //  }
  //  else if (tgt.getAttribute ('class') == RABTN) {
  //    form = tgt.parentNode.parentNode.nextSibling.firstChild.firstChild.lastChild.lastChild.firstChild.lastChild.firstChild.firstChild.firstChild.nextSibling.firstChild;
  //  }
  //}
  if (!form) {
    gBccLog (L_ERR, "No form");
    return;
  }
  var header = GM_getValue ('gBccHeader');
  if (!header || !(header == "cc" || header == "bcc")) {
    header = "bcc";
    GM_setValue ('gBccHeader', "bcc");
  }
  gBccLog (L_VER, "Header = " + header);
  var dst_field;
  if (header == "cc")
    dst_field = form.elements.namedItem('cc');
  else 
    dst_field = form.elements.namedItem('bcc');
  if (!dst_field) {
    gBccLog (L_ERR, "No dst");
    return;
  }
  var gStatus = dst_field.getAttribute ('gid');
  dst_field.setAttribute ('gid', "gBccDone");
  /* Get the address to cc/bcc to */
  var mapFrom = GM_getValue ('gBccMapFromAddress');
  var remove = false;
  if (mapFrom == true && form.elements.namedItem ('from')) {
    gBccLog (L_VER, "Mapping identities");
    var from = form.elements.namedItem('from').value;
    var email = GM_getValue ('gBccMail_' + from);
    if (gStatus == "gBccDone") {
      if (tgt.nodeName == 'SELECT') {
        var lue = GM_getValue ('gBccLU');
        if (lue == email) {
          gBccLog (L_VER, "Already copied");
          return;
        }
        var lu = new RegExp (lue + "(, )?");
        remove = true;
      }
      else {
        return;
      }
    }
    if (email == "disabled") {
      gBccLog (L_VER, "Disabled for sender " + from);
      return;
    }
    if (!email) {
      email = prompt("gmailAutoBcc: Where do you want to bcc/cc your outgoing gmail sent from identity: " + from + "?\n\n Leave blank to disable gmailAutoBcc for this identity.");
      if (email == false) {
        GM_setValue ('gBccMail_' + from, "disabled");
        gBccLog (L_VER, "Disabling for sender " + from);
        return;
      }
      GM_setValue ('gBccMail_' + from, email);
      gBccLog (L_VER, "Enabling for sender " + from + "; Copying " + email);
    }
  }
  else {
    gBccLog (L_VER, "Not mapping");
    if (gStatus == "gBccDone") {
      /* Don't insert again! */
      gBccLog (L_VER, "Already copied");
      return;
    }
    var email = GM_getValue('gBccMail');
    if (!email) {
      email = prompt("gmailAutoBcc: Where do you want to bcc/cc all your outgoing gmail?");
      if (email == false) 
        return;
      GM_setValue('gBccMail', email);
      gBccLog (L_VER, "Enabling default, copying " + email);
    }
    if (mapFrom != false) 
      GM_setValue('gBccMapFromAddress', false); // FALSE by default
  }
  /* Should we confirm? */
  var popup = GM_getValue ('gBccPopup');
  if (popup == true) {
    if (confirm("Do you want to add BCC to " + email + "?") == false) {
      gBccLog (L_VER, "Not copying");
      return;
    }
  }
  else if (popup != false) {
    GM_setValue ('gBccPopup', false); // FALSE by default
  }
  if (dst_field.value) {
    if (remove) {
      var bcc_str = dst_field.value;
      if (bcc_str.match (lu)) {
        /* Remove old email */
        var new_bcc_str = bcc_str.replace (lu, "");
        var end = new RegExp ("(, )?$");
        dst_field.value = new_bcc_str.replace (end, "");
        gBccLog (L_VER, "Replaced " + lue + " with " + email);
      }
    }
  }
  if (dst_field.value) {
    dst_field.value = dst_field.value+", " +email;
  }
  else {
    dst_field.value = email;
  }
  gBccLog (L_VER, "Copied " + email);
  /* Don't repeat */
  GM_setValue ('gBccLU', email);
}

function gBccInit () 
{
  try {
    var root = document;
    root.addEventListener ("blur", function(event) {
      if (typeof (event.target.getAttribute) == 'function') {
        var tg_cl = event.target.getAttribute ("class");
        if (tg_cl == TOCLS) {
          gBccLog (L_VER, "Trigger = field");
          addBcc (event.target);
        }
        else if (tg_cl == REBTN || tg_cl == RABTN) {
          gBccLog (L_VER, "Trigger = timeout");
          window.setTimeout (addBcc, 500, event.target);
        }
        else {
          return;
        }
      }
    }, true);
    root.addEventListener ("change", function (event) {
      if (event.target.getAttribute ('name') == 'from') {
        gBccLog (L_VER, "Trigger = sender change");
        addBcc (event.target);
      }
    }, true);
    gBccLog (L_VER, "Initialized Script");
  }
  catch (ex) {
    GM_log ("gmailAutoBcc: Exception '"+ ex.message +"'. Retry in 250ms.");
    window.setTimeout (gBccInit, 250);
  }
} /* gBccInit */

window.setTimeout (gBccInit, 750);
