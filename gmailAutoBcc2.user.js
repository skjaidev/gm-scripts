/* This greasemonkey script automatically BCCs (or CCs) outgoing email from a gmail address to a 
 *  specified email address
 * 
 *  $Id$
 *  $Author$
 *  $Date$
 *  $Version: $
 *  Copyright (c) 2005, Jaidev Krishna S
 *  Released under the GPL license
 *  http://www.gnu.org/copyleft/gpl.html
 */

// ==UserScript==
// @name          Gmail Auto BCC
// @namespace     http://jaidev.info/home/projects/gmailAutoBcc
// @description   This greasemonkey script automatically BCCs (or CCs) outgoing email from a gmail address to a specified email address. This version is for the "new" version of gmail (Nov 2007).
// @include       http*://mail.google.com/mail/*
// ==/UserScript==

// gBccMail = email Address		Email address to BCC to
// gBccEnabled = true / false		
// gBccPopup = true / false	Pops up a prompt before adding BCC
// gBccHeader = "bcc"		Header to add. By default BCC.

window.addEventListener('load', function() {
    if (unsafeWindow.gmonkey) {
        unsafeWindow.gmonkey.load("1.0", function(gmail) {
            function gBccInit () {
                var root = gmail.getNavPaneElement().ownerDocument;
                root.addEventListener ('click', function(event) {
                    var SEND_BUTTON1_DIV_CLASS = "LlWyA c1I77d";
                    var SEND_BUTTON2_DIV_CLASS = "CoUvaf c1I77d";
                    var click = 0;
                	if (event.target.parentNode.getAttribute ("class") == SEND_BUTTON1_DIV_CLASS) {
                        click = 1;
                    }
                    else if (event.target.parentNode.getAttribute ("class") == SEND_BUTTON2_DIV_CLASS) {
                        click = 2;
                    }
                    if (click != 0) {
                        var enabled = GM_getValue('gBccEnabled');
	        	        if (enabled == false) {
	        	        	return;
	        	        }
	        	        else if (enabled != true) {
	        	        	GM_setValue('gBccEnabled', true);
	        	        	GM_setValue('gBccPopup', false); // FALSE by default
	        	        	GM_setValue('gBccMapFromAddress', false); // FALSE by default
	        	        	enabled = true;
	        	        }
                        var form_div = "";
                        switch (click) {
                            case 1:
                                form_div = event.target.parentNode.nextSibling;
                                break;
                            case 2:
                                form_div = event.target.parentNode.previousSibling;
                                break;
                        }
		                var header = GM_getValue ('gBccHeader');
		                if (!header || !(header == "cc" || header == "bcc")) {
		                	header = "bcc";
		                	GM_setValue ('gBccHeader', "bcc");
		                }
                        var dest_tr = "";
                        if (header == "cc")
                            dest_tr = form_div.firstChild.firstChild.firstChild.firstChild.nextSibling.nextSibling;
                        else 
                            dest_tr = form_div.firstChild.firstChild.firstChild.firstChild.nextSibling.nextSibling.nextSibling;
                        var dst_field = dest_tr.lastChild.firstChild;
		                if (!(dst_field && (dst_field.getAttribute ("gid") != "gBccDone") || dst_field.value == ""))  {
                            /* TBD: Change last cond to if_contains (email) */
                            return;
                        }
                        var mapFrom = GM_getValue ('gBccMapFromAddress');
		                if (mapFrom == true) {
		                	var from = form_div.firstChild.elements.namedItem('from').value;
		                	var email = GM_getValue ('gBccMail_' + from);
		                	if (email == "disabled")
		                		return;
		                	if (!email) {
		                		email = prompt("gmailAutoBcc: Where do you want to bcc/cc your outgoing gmail sent from identity: " + from + "?\n\n Leave blank to disable gmailAutoBcc for this identity.");
		                		if (!email) {
		                			GM_setValue ('gBccMail_' + from, "disabled");
		                			return;
		                		}
		                		GM_setValue ('gBccMail_' + from, email);
		                	}
		                }
		                else {
		                	var email = GM_getValue('gBccMail');
		                	if (!email) {
		                		email = prompt("gmailAutoBcc: Where do you want to bcc/cc all your outgoing gmail?");
		                		if (!email) 
		                			return;
		                		GM_setValue('gBccMail', email);
		                	}
		                	if (mapFrom != false) 
		                		GM_setValue('gBccMapFromAddress', false); // FALSE by default
		                }
		                var popup = GM_getValue ('gBccPopup');
		                if (popup == true) {
		                	if (!confirm("Do you want to add BCC to " + email + "?")) {
                                dst_field.setAttribute("gid", "gBccDone");
		                		return;
                            }
		                }
		                else if (popup != false) {
		                	GM_setValue ('gBccPopup', false); // FALSE by default
		                }
		                if (dst_field.value) {
		                	dst_field.value = dst_field.value+", " +email;
		                }
		                else {
		                	dst_field.value = email;
                        }
                        dst_field.setAttribute("gid", "gBccDone");
                    }
                }, true);
            } /* gBccInit */
            gBccInit ();
            gmail.registerViewChangeCallback (gBccInit);
        });
    }
}, true);
