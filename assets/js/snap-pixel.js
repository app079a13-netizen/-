(function (e, t, n) {
  if (e.snaptr) return;
  var a = (e.snaptr = function () {
    a.handleRequest
      ? a.handleRequest.apply(a, arguments)
      : a.queue.push(arguments);
  });
  a.queue = [];
  var s = "script";
  var r = t.createElement(s);
  r.async = true;
  r.src = n;
  var u = t.getElementsByTagName(s)[0];
  u.parentNode.insertBefore(r, u);
})(window, document, "https://sc-static.net/scevent.min.js");

snaptr("init", "b6e28deb-427e-4a59-82f1-da1c331d5908", {});
snaptr("track", "PAGE_VIEW");
