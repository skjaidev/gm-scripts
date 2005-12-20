/* This greasemonkey script adds 'Unlabelled' at the end of the labels list to search for unlabelled conversations
 * 
 *  $Id$
 *  $Author$
 *  $Date$
 *  Copyright (c) 2005, Jaidev Krishna S
 *  Released under the GPL license
 *  http://www.gnu.org/copyleft/gpl.html
 */

// ==UserScript==
// @name          Gmail Unlabelled
// @namespace     http://jaidev.info/home/projects/gmailUnlabelled
// @description   This script adds 'Unlabelled' at the end of the labels list to search for unlabelled conversations
// @include       http*://mail.google.com/*
// ==/UserScript==



function process_frame (id)
{
	var iframe = document.getElementById(id);
	if (iframe) {
		iframe.addEventListener ('DOMAttrModified', function () {
			window.setTimeout (function () {
				if (!iframe.wrappedJSObject.contentDocument.getElementById ('label_none')) {
					var edit_labels = iframe.wrappedJSObject.contentDocument.getElementById ('prf_l');
					if (edit_labels) {
						var label_none = edit_labels.cloneNode (true);
						label_none.setAttribute ("id", "label_none");
						label_none.setAttribute ("onclick", "var iter = this; var str = ''; while (iter.previousSibling != null) { iter = iter.previousSibling; str = str + ' -label:' + iter.getAttribute('id').substr(3).replace(' ', '-'); }var s = document.getElementById ('s'); s.elements.namedItem('q').value = str; return top.js._MH_OnSearch(window,0);");
						label_none.innerHTML = "Unlabelled";
						edit_labels.parentNode.insertBefore (label_none, edit_labels);
					}
				}
			}, 0);
		}, true);
	}
}

process_frame ('v1');
process_frame ('v2');

