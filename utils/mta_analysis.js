var MTA_CONFIG = { app_id: "", event_id: "", api_base: "https://pingtas.qq.com/pingd", prefix: "_mta_", version: "1.3.1", stat_share_app: !1, stat_pull_down_fresh: !1, stat_reach_bottom: !1 }; function getNetworkType(a) { wx.getNetworkType({ success: function (b) { a(b.networkType) } }) } function getSystemInfo() { var a = wx.getSystemInfoSync(); return { adt: encodeURIComponent(a.model), scl: a.pixelRatio, scr: a.windowWidth + "x" + a.windowHeight, lg: a.language, fl: a.version, jv: encodeURIComponent(a.system), tz: encodeURIComponent(a.platform) } }
function getUID() { try { return wx.getStorageSync(MTA_CONFIG.prefix + "auid") } catch (a) { } } function setUID() { try { var a = getRandom(); wx.setStorageSync(MTA_CONFIG.prefix + "auid", a); return a } catch (b) { } } function getSID() { try { return wx.getStorageSync(MTA_CONFIG.prefix + "ssid") } catch (a) { } } function setSID() { try { var a = "s" + getRandom(); wx.setStorageSync(MTA_CONFIG.prefix + "ssid", a); return a } catch (b) { } } function getRandom(a) { return (a || "") + Math.round(2147483647 * (Math.random() || .5)) * +new Date % 1E10 }
function getPagePath() { try { var a = getCurrentPages(), b = "/"; 0 < a.length && (b = a.pop().__route__); return b } catch (e) { console.log("get current page path error:" + e) } } function getMainInfo() { var a = { dm: "wechat.apps.xx", url: getPagePath(), pvi: "", si: "", ty: 0 }; a.pvi = function () { var b = getUID(); b || (b = setUID(), a.ty = 1); return b }(); a.si = function () { var a = getSID(); a || (a = setSID()); return a }(); return a }
function getBasicInfo() { var a = getSystemInfo(); getNetworkType(function (a) { wx.setStorageSync(MTA_CONFIG.prefix + "ntdata", a) }); a.ct = wx.getStorageSync(MTA_CONFIG.prefix + "ntdata") || "4g"; return a } function getExtentInfo() { return { r2: MTA_CONFIG.app_id, r4: "wx", ext: "v=" + MTA_CONFIG.version } }
var MTA = {
    App: { init: function (a) { "appID" in a && (MTA_CONFIG.app_id = a.appID); "eventID" in a && (MTA_CONFIG.event_id = a.eventID); "statShareApp" in a && (MTA_CONFIG.stat_share_app = a.statShareApp); "statPullDownFresh" in a && (MTA_CONFIG.stat_pull_down_fresh = a.statPullDownFresh); "statReachBottom" in a && (MTA_CONFIG.stat_reach_bottom = a.statReachBottom); setSID() } }, Page: {
        init: function () {
            var a = getCurrentPages()[getCurrentPages().length - 1]; a.onShow && !function () {
                var b = a.onShow; a.onShow = function () {
                    MTA.Page.stat(); b.call(this,
                        arguments)
                }
            }(); MTA_CONFIG.stat_pull_down_fresh && a.onPullDownRefresh && !function () { var b = a.onPullDownRefresh; a.onPullDownRefresh = function () { MTA.Event.stat(MTA_CONFIG.prefix + "pulldownfresh"); b.call(this, arguments) } }(); MTA_CONFIG.stat_reach_bottom && a.onReachBottom && !function () { var b = a.onReachBottom; a.onReachBottom = function () { MTA.Event.stat(MTA_CONFIG.prefix + "reachbottom"); b.call(this, arguments) } }(); MTA_CONFIG.stat_share_app && a.onShareAppMessage && !function () {
                var b = a.onShareAppMessage; a.onShareAppMessage =
                    function () { MTA.Event.stat(MTA_CONFIG.prefix + "shareapp", { url: a.__route__ }); return b.call(this, arguments) }
            }()
        }, stat: function () { if ("" != MTA_CONFIG.app_id) { for (var a = [], b = 0, e = [getMainInfo(), getExtentInfo(), getBasicInfo(), { rand: +new Date }], d = e.length; b < d; b++)for (var f in e[b]) e[b].hasOwnProperty(f) && a.push(f + "=" + ("undefined" == typeof e[b][f] ? "" : e[b][f])); wx.request({ url: MTA_CONFIG.api_base + "?" + a.join("&").toLowerCase() }) } }
    }, Event: {
        stat: function (a, b) {
            if ("" != MTA_CONFIG.event_id) {
                var e = [], d = getMainInfo(), f =
                    getExtentInfo(); d.dm = "wxapps.click"; d.url = a; f.r2 = MTA_CONFIG.event_id; var c; c = "undefined" === typeof b ? {} : b; var k = [], g; for (g in c) c.hasOwnProperty(g) && k.push(g + "=" + c[g]); c = k.join(";"); f.r5 = c; c = 0; d = [d, f, getBasicInfo(), { rand: +new Date }]; for (f = d.length; c < f; c++)for (var h in d[c]) d[c].hasOwnProperty(h) && e.push(h + "=" + ("undefined" == typeof d[c][h] ? "" : d[c][h])); wx.request({ url: MTA_CONFIG.api_base + "?" + e.join("&").toLowerCase() })
            }
        }
    }
}; module.exports = MTA;