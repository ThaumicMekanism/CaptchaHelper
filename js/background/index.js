var globalStatus = {};

function saveOptions(options, cb) {
    (chrome.storage.sync ? chrome.storage.sync : chrome.storage.local).set(options, function() {
        if (cb) {
            cb(options)
        }
        initGlobalStatus()
    })
}

function initGlobalStatus() {
    (chrome.storage.sync ? chrome.storage.sync : chrome.storage.local).get({
        enable_autoclick: true,
        autoclick_exclusions: []
    }, function(items) {
        globalStatus.enable_autoclick = items.enable_autoclick;
        globalStatus.autoclick_exclusions = items.autoclick_exclusions
    })
}
initGlobalStatus();
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type == "getGlobalStatus") {
        delete request.type;
        sendResponse(globalStatus)
    }
    return true
});