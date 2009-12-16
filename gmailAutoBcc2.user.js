/* This greasemonkey script automatically BCCs (or CCs) outgoing email from 
 * a gmail address to a specified email address
 * 
 * Author: Jaidev K Sridhar mail<AT>jaidev<DOT>info
 * 
 * Copyright (c) 2005-2008, Jaidev K Sridhar
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

var TOCLS = "dK nr";
var REBTN = "J-K-I J-J5-Ji J-K-I-Js-KK GZ L3";
function addBcc (tgt) {
  var enabled = GM_getValue('gBccEnabled');
  if (enabled == false) {
    return;
  }
  else if (enabled != true) {
    /* We're probably running for the first time */
    GM_setValue('gBccEnabled', true);
    GM_setValue('gBccPopup', false); // FALSE by default
    GM_setValue('gBccMapFromAddress', false); // FALSE by default
    enabled = true;
  }
//  var tg_cl = tgt.getAttribute ("class");
  var form;
// if (tg_cl == TOCLS) {
  if (tgt.form) {
    form = tgt.form;
  }
  else {
    form = tgt.parentNode.parentNode.nextSibling.firstChild.firstChild.firstChild.nextSibling.lastChild.firstChild.lastChild.firstChild.firstChild.firstChild.nextSibling.firstChild;
  }
  var header = GM_getValue ('gBccHeader');
  if (!header || !(header == "cc" || header == "bcc")) {
    header = "bcc";
    GM_setValue ('gBccHeader', "bcc");
  }
  var dst_field;
  if (header == "cc")
    dst_field = form.elements.namedItem('cc');
  else 
    dst_field = form.elements.namedItem('bcc');
  /* Get the address to cc/bcc to */
  var mapFrom = GM_getValue ('gBccMapFromAddress');
  var remove = false;
  if (mapFrom == true) {
    var from = form.elements.namedItem('from').value;
    var email = GM_getValue ('gBccMail_' + from);
    if (dst_field.getAttribute ("gid") == "gBccDone") {
      if (tgt.nodeName == 'SELECT') {
        var lue = GM_getValue ('gBccLU');
        if (lue == email)
          return;
        var lu = new RegExp (lue + "(, )?");
        remove = true;
      }
      else {
        return;
      }
    }
    if (email == "disabled")
      return;
    if (!email) {
      email = prompt("gmailAutoBcc: Where do you want to bcc/cc your outgoing gmail sent from identity: " + from + "?\n\n Leave blank to disable gmailAutoBcc for this identity.");
      if (email == false) {
        GM_setValue ('gBccMail_' + from, "disabled");
        return;
      }
      GM_setValue ('gBccMail_' + from, email);
    }
  }
  else {
    if (dst_field.getAttribute ("gid") == "gBccDone")
      /* Don't insert again! */
      return;
    var email = GM_getValue('gBccMail');
    if (!email) {
      email = prompt("gmailAutoBcc: Where do you want to bcc/cc all your outgoing gmail?");
      if (email == false) 
        return;
      GM_setValue('gBccMail', email);
    }
    if (mapFrom != false) 
      GM_setValue('gBccMapFromAddress', false); // FALSE by default
  }
  /* Should we confirm? */
  var popup = GM_getValue ('gBccPopup');
  if (popup == true) {
    if (confirm("Do you want to add BCC to " + email + "?") == false) {
      dst_field.setAttribute("gid", "gBccDone");
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
      }
    }
  }
  if (dst_field.value) {
    dst_field.value = dst_field.value+", " +email;
  }
  else {
    dst_field.value = email;
  }
  /* Don't repeat */
  GM_setValue ('gBccLU', email);
  dst_field.setAttribute("gid", "gBccDone");
}

window.addEventListener('load', function() {
if (unsafeWindow.gmonkey) {
  unsafeWindow.gmonkey.load("1.0", function(gmail) {
    function gBccInit () {
      var root = gmail.getActiveViewElement().ownerDocument;
      root.addEventListener ("blur", function(event) {
        if (typeof (event.target.getAttribute) == 'function') {
          var tg_cl = event.target.getAttribute ("class");
          if (tg_cl == TOCLS) {
            addBcc (event.target);
          }
          else if (tg_cl == REBTN) {
            window.setTimeout (addBcc, 500, event.target);
          }
          else {
            return;
          }
        }
      }, true);
      root.addEventListener ("change", function (event) {
        if (event.target.getAttribute ('name') == 'from') {
          addBcc (event.target);
        }
      }, true);
    } /* gBccInit */
    window.setTimeout (gBccInit, 500);
    gmail.registerViewChangeCallback (gBccInit);
  });
}
}, true);

