// portfolio-2026-rewrite  —  CloudFront Function, runtime cloudfront-js-2.0
// trigger: viewer-request
//
// encode `trailingSlash: true` ของ next.config.ts — ถ้าค่านั้นเปลี่ยน ต้องแก้ไฟล์นี้ตาม
// หน้าที่: แทนพฤติกรรม index-document + trailing-slash redirect ที่ S3 website endpoint เคยทำ
// (REST endpoint + OAC ไม่ทำให้) + redirect www -> apex (canonical host กัน duplicate content)
// www ไม่ normalize uri ก่อน redirect (ตั้งใจ, ลดความเสี่ยงต่อ apex path ที่ live อยู่แล้ว) —
// เคส www ที่ไม่มี "/" ท้ายจะโดน redirect 2 ครั้ง (www->apex, แล้ว apex เติม "/") ยอมรับได้เพราะ
// ลิงก์จริงในเว็บใช้ trailing slash หมดอยู่แล้ว เคสนี้เกิดแค่ตอนคนพิมพ์ URL เอง

function handler(event) {
  var request = event.request;
  var uri = request.uri;

  // 0. www -> apex (canonical host)
  var host = request.headers.host && request.headers.host.value;
  if (host === "www.anyawee-sr.com") {
    return redirect(uri, request, "https://anyawee-sr.com");
  }

  // 1. ยุบ slash ซ้ำ -> 301 ไป path สะอาด
  if (uri.indexOf("//") !== -1) {
    var clean = uri;
    while (clean.indexOf("//") !== -1) clean = clean.replace("//", "/");
    return redirect(clean, request);
  }

  // 2. root -> landing page
  if (uri === "/") {
    request.uri = "/index.html";
    return request;
  }

  // 3. ลงท้าย "/" -> ต่อ index.html
  if (uri.charAt(uri.length - 1) === "/") {
    request.uri = uri + "index.html";
    return request;
  }

  // 4. segment สุดท้ายมีจุด -> เป็นไฟล์จริง ปล่อยผ่าน
  var last = uri.substring(uri.lastIndexOf("/") + 1);
  if (last.indexOf(".") !== -1) return request;

  // 5. ไม่มี extension ไม่มี trailing slash -> 301 เติม slash (ตรงกับ sitemap.xml)
  return redirect(uri + "/", request);
}

function redirect(location, request, origin) {
  var q = "";
  var qs = request.querystring;
  if (qs) {
    var parts = [];
    for (var k in qs) {
      var v = qs[k];
      if (v.multiValue) {
        for (var i = 0; i < v.multiValue.length; i++) parts.push(k + "=" + v.multiValue[i].value);
      } else if (v.value === "") {
        parts.push(k);
      } else {
        parts.push(k + "=" + v.value);
      }
    }
    if (parts.length) q = "?" + parts.join("&");
  }
  return {
    statusCode: 301,
    statusDescription: "Moved Permanently",
    headers: {
      location: { value: (origin || "") + location + q },
      "cache-control": { value: "public, max-age=3600" },
    },
  };
}
