/*
 * bg.js
 * Copyright (C) 2017 Enzo Yang <divisoryang@gmail.com>
 *
 */

/**
 * 对QQ空间高亮 icon
 */
// function checkForValidUrl(tabId, changeInfo, tab) 
// {
//     if(typeof tab != "undefined" && typeof tab != "null" )
//     {
//         // If the tabs URL contains "qzone.qq.com"...
//         //This would work in the same way as *specificsite.com*, with 0 or more characters surrounding the URL.
//         if (/https:\/\/user[.]qzone[.]qq[.]com/.test(tab.url)) 
//         {
//             // ... show the page action.
//             chrome.pageAction.show(tabId);
//         }
//     }
// };

// Listen for any changes to the URL of any tab.
// chrome.tabs.onUpdated.addListener(checkForValidUrl);

/**
 * 监听页面是否可以用这个插件
 */
chrome.runtime.onMessage.addListener(function (msg, sender) {
  if ((msg.from === 'content') && (msg.subject === 'showPageAction')) {
    // Enable the page-action for the requesting tab
    chrome.pageAction.show(sender.tab.id);
  }
});