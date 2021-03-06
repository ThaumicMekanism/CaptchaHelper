$(function() {
    var documentUrl = parseUrl(document.URL);
    if ((documentUrl.hostname + documentUrl.pathname).indexOf("www.google.com/recaptcha/api2/bframe") != -1 && typeof document.referrer != "undefined") {
        function getRecaptchaType(eventData) {
            if (typeof eventData.type != "undefined" && eventData.type == "loadend" && typeof eventData.responseText != "undefined" && eventData.responseText[0]) {
                if (eventData.responseText[0] == "rresp" && typeof eventData.responseText[5] != "undefined") {
                    return eventData.responseText[5]
                } else if (eventData.responseText[0] == "uvresp" && typeof eventData.responseText[7] != "undefined" && typeof eventData.responseText[7][0] != "undefined" && eventData.responseText[7][0] == "rresp" && typeof eventData.responseText[7][5] != "undefined") {
                    return eventData.responseText[7][5]
                }
            }
        }

        function multiSelectElementSelected($elem) {
            return $elem.hasClass("rc-imageselect-tileselected")
        }

        function multiSelect() {
            var isdown;
            var hasSelectedClass;
            $("#rc-imageselect-target td").bind("mousedown mouseup mouseover mouseout", function(e) {
                $this = $(this);
                if (e.button == 0) {
                    switch (e.type) {
                        case "mousedown":
                            isdown = 1;
                            hasSelectedClass = multiSelectElementSelected($this);
                            break;
                        case "mouseup":
                            isdown = 0;
                            break;
                        case "mouseover":
                        case "mouseout":
                            if (isdown == 1 && hasSelectedClass == multiSelectElementSelected($this)) {
                                $this.find("img").click()
                            }
                            break;
                        default:
                            break
                    }
                }
            });
            $("#rc-imageselect-target").bind("DOMNodeRemoved", function(e) {
                multiSelect()
            })
        }

        function multiSelectDynamic() {
            var isdown;
            $("#rc-imageselect-target td").bind("mousedown mouseup mouseover mouseout", function(e) {
                $this = $(this);
                if (e.button == 0) {
                    switch (e.type) {
                        case "mousedown":
                            isdown = 1;
                            break;
                        case "mouseup":
                            isdown = 0;
                            break;
                        case "mouseover":
                        case "mouseout":
                            if (isdown == 1) {
                                $this.find("img").click()
                            }
                            break;
                        default:
                            break
                    }
                }
            })
        }

        function waitForSelector(selector, cb) {
            var interval = setInterval(function() {
                if ($(selector).length) {
                    clearInterval(interval);
                    cb()
                }
            }, 100);
            setTimeout(function() {
                clearInterval(interval)
            }, 1e3)
        }

        function triggerMouseEvent(node, eventType) {
            var clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent(eventType, true, true);
            node.dispatchEvent(clickEvent)
        }

        function verifyClick() {
            var targetNode = document.getElementById("recaptcha-verify-button");
            if (targetNode) {
                triggerMouseEvent(targetNode, "mouseover");
                triggerMouseEvent(targetNode, "mousedown");
                triggerMouseEvent(targetNode, "mouseup");
                triggerMouseEvent(targetNode, "click")
            }
        }
        var injectedCode = "(" + function() {
            if ("undefined" !== typeof CustomEvent && "function" === typeof window.dispatchEvent && "undefined" !== typeof XMLHttpRequest && XMLHttpRequest.prototype && XMLHttpRequest.prototype.send) {
                XMLHttpRequest.prototype.send = function(c) {
                    return function(f) {
                        var d = this;
                        d.addEventListener("loadend", function(event) {
                            function replaceAll(str, find, replace) {
                                return str.replace(new RegExp(find, "g"), replace)
                            }
                            var response = JSON.parse(replaceAll(replaceAll(d.responseText.replace(")]}'", ""), ",,", ',"",'), ",,", ',"",'));
                            window.postMessage({
                                type: "loadend",
                                responseText: response
                            }, "*")
                        });
                        return c.apply(d, arguments)
                    }
                }(XMLHttpRequest.prototype.send)
            }
        } + ")();";
        var script = document.createElement("script");
        script.textContent = injectedCode;
        (document.head || document.documentElement).appendChild(script);
        script.remove();
        document.addEventListener("contextmenu", function(e) {
            e.preventDefault()
        }, false);
        window.addEventListener("message", function(event) {
            if (!event.data || typeof event.data.responseText == "undefined") {
                return
            }
            var recapthaType = getRecaptchaType(event.data);
            if (recapthaType) {
                switch (recapthaType) {
                    case "dynamic":
                        waitForSelector("#rc-imageselect-target", multiSelectDynamic);
                        break;
                    case "multicaptcha":
                        waitForSelector("#rc-imageselect-target", multiSelect);
                        break;
                    default:
                }
                $(document.body).mousedown(function(e) {
                    if (e.button == 2) {
                        verifyClick()
                    }
                })
            }
        })
    }
});