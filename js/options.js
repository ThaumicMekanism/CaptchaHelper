function initFieldsUsingGlobalStatusValues() {
    $("input[name=enable_autoclick]").attr("checked", chrome.extension.getBackgroundPage().globalStatus.enable_autoclick);
    var autoclickExclusions = chrome.extension.getBackgroundPage().globalStatus.autoclick_exclusions;
    $("#autoclick_exclusions").val(autoclickExclusions.join("\n"))
}

function dataChangeAnimation(fieldId, savedIndicatorId) {
    $("#" + fieldId).addClass("changed");
    $("#" + savedIndicatorId).addClass("saved");
    setTimeout(function() {
        $("#" + fieldId).removeClass("changed");
        $("#" + savedIndicatorId).removeClass("saved")
    }, 1e3)
}
$("input[name=enable_autoclick]").click(function() {
    chrome.extension.getBackgroundPage().saveOptions({
        enable_autoclick: this.checked
    }, function() {
        dataChangeAnimation("enable_autoclick", "saved_indicator")
    })
});
$("input[name=save_autoclick_exclusions]").click(function() {
    var autoclickExclusions = $("#autoclick_exclusions").val();
    autoclickExclusions = autoclickExclusions.split("\n");
    autoclickExclusions = autoclickExclusions.filter($.trim);
    autoclickExclusions = autoclickExclusions.map($.trim);
    chrome.extension.getBackgroundPage().saveOptions({
        autoclick_exclusions: autoclickExclusions
    }, function() {
        dataChangeAnimation("autoclick_exclusions", "saved_indicator")
    })
});
initFieldsUsingGlobalStatusValues();