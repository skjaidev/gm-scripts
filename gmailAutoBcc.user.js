/* This greasemonkey script automatically BCCs outgoing email to a 
 *  specified email address
 * 
 *  $Id$
 *  $Author$
 *  $Date$
 *  Copyright (c) 2005, Jaidev Krishna S
 *  Released under the GPL license
 *  http://www.gnu.org/copyleft/gpl.html
 */

// ==UserScript==
// @name          Gmail Auto BCC
// @namespace     http://jaidev.info/home/projects/gmailAutoBcc
// @description   This greasemonkey script automatically BCCs outgoing email to a specified email address
// @include       http*://mail.google.com/mail/*
// ==/UserScript==
if (!GM_getValue('gBccMail')) {
	email = prompt("gmailAutoBcc: Where do you want to bcc all your outgoing gmail?");
	GM_setValue('gBccMail', email);
} 
document.addEventListener ('click', function(event) {
	if (event.target.getAttribute ("id") == "send") {
		var email = GM_getValue('gBccMail');
		var bcc = document.getElementById ("bcc_compose");
		if (bcc) {
			var bccs = bcc.value;
			if (bccs) {
				/* TBD: Don't do it if it is already done!  */
				bcc.value = bccs+"," +email;
			}
			else 
				bcc.value = email;
			return;
		}
		var bcc = document.getElementById ("bcc_0");
		if (bcc) {
			var bccs = bcc.value;
			if (bccs) {
				/* TBD: Don't do it if it is already done!  */
				bcc.value = bccs+", "+email;
			}
			else 
				bcc.value = email;
			return;
		}
	}
	}, 
	true);
