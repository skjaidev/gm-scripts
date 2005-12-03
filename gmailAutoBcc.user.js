/* This greasemonkey script automatically BCCs outgoing email from a gmail address to a 
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
// @description   This greasemonkey script automatically BCCs outgoing email from a gmail address to a specified email address
// @include       http*://mail.google.com/mail/*
// ==/UserScript==

// gBccMail = email Address		Email address to BCC to
// gBccEnabled = true / false		
// gBccPopup = true / false	Pops up a prompt before adding BCC

document.addEventListener ('click', function(event) {
	if (event.target.getAttribute ("id") == "send") {
		enabled = GM_getValue('gBccEnabled');
		if (enabled == false) {
			return;
		}
		else if (enabled != true) {
			GM_setValue('gBccEnabled', true);
			GM_setValue('gBccPopup', false); // FALSE by default
			enabled = true;

		}
		var email = GM_getValue('gBccMail');
		if (!email) {
			email = prompt("gmailAutoBcc: Where do you want to bcc all your outgoing gmail?");
			GM_setValue('gBccMail', email);
		}
		var popup = GM_getValue ('gBccPopup');
		if (popup == true) {
			if (!confirm("Do you want to add BCC to " + email + "?"))
				return;
		}
		else if (popup != false) {
			GM_setValue ('gBccPopup', false); // FALSE by default
		}
		var msg_type = event.target.form.parentNode.getAttribute("id");
		var bcc_id;
		if (msg_type == "cm_compose") {
			bcc_id = "bcc_compose";
		}
		else {
			bcc_id = "bcc_"+ msg_type.substr (3,1);
		}
		var bcc_field = document.getElementById (bcc_id);
		if (bcc_field) { 
			var bccs = bcc_field.value;
			if (bccs) {
				/* TBD: Don't do it if it is already done!  */
				bcc_field.value = bccs+"," +email;
			}
			else 
				bcc_field.value = email;
		}
	}
	}, 
	true);
