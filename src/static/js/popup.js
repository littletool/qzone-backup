/*
 * popup.js
 * Copyright (C) 2017 Enzo Yang <divisoryang@gmail.com>
 *
 */

$("#backup").click(function () {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {from: 'popup', subject: 'startBackup'});
    });
});

$(".link").click(function (e) {
    e.preventDefault();
    chrome.tabs.create({url: $(this).attr('href')});
});