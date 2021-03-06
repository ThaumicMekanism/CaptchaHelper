var globalStatusInfo;
$(document).ready(function() {
    if (window.location.href.match(/https:\/\/www.google.com\/recaptcha\/api\d\/anchor/) && typeof document.referrer != "undefined") {
        chrome.runtime.sendMessage({
            type: "getGlobalStatus"
        }, function(globalStatus) {
            globalStatusInfo = globalStatus;
            if (typeof globalStatusInfo.enable_autoclick !== "undefined" && globalStatusInfo.enable_autoclick) {
                var parentUrl = window.location != window.parent.location ? document.referrer : document.location.href;
                var parentUrlParsed = parseUrl(parentUrl);
                if (typeof globalStatusInfo.autoclick_exclusions !== "object" || !Array.isArray(globalStatusInfo.autoclick_exclusions) || globalStatusInfo.autoclick_exclusions.indexOf(parentUrlParsed.hostname) === -1) {
                    var interval = setInterval(function() {
                        if ($(".recaptcha-checkbox").length) {
                            clearInterval(interval);
                            $(".recaptcha-checkbox").click()
                        }
                    }, 500);
                    setTimeout(function() {
                        clearInterval(interval)
                    }, 1e4)
                }
            }
        })
    }
});