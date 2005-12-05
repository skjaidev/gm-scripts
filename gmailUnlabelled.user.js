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

var edit_labels = document.getElementById ('prf_l');
if (edit_labels) {
	var label_none = edit_labels.cloneNode (true);
	label_none.setAttribute ("id", "label_none");
	label_none.setAttribute ("onclick", "var iter = this; var str = ''; while (iter.previousSibling != null) { iter = iter.previousSibling; str = str + ' -label:' + iter.getAttribute('id').substr(3).replace(' ', '_'); }var s = document.getElementById ('s'); for (var i = 0; i < s.childNodes.length; i++) {	var q = s.childNodes[i]; 	if (q.getAttribute('name') == 'q') 	{		q.value = str; 		return top.js._MH_OnSearch(window,0);	}}");
	label_none.innerHTML = "Unlabelled";
	edit_labels.parentNode.insertBefore (label_none, edit_labels);
}
