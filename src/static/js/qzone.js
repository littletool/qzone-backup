/*
 * qzone.js
 * Copyright (C) 2017 Enzo Yang <divisoryang@gmail.com>
 *
 * 获得QQ空间的一些基础数据，和API接口
 */

/**
 * 获得一个Cookie值
 * 
 * @param {string} name
 */
function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) {
        return parts.pop().split(";").shift();
    }
}

/**
 * 从 HTML 页面找到 token 保存起来
 */
function storeQzoneToken() {
    $("script").each(function(index) {
        var t = $(this).text();
        t = t.replace(/\ /g, "");
        if (t.indexOf('window.g_qzonetoken') !== -1) {
            var qzonetokenM = /return"(\w*?)";/g;
            var qzonetoken = qzonetokenM.exec(t);
            if (qzonetoken != null) {
                console.log("qzonetoken="+qzonetoken[1]);
                window.g_qzonetoken=qzonetoken[1];
            }
            return false;
        } 
    });
}

/**
 * 从当前 URL 拿出QQ号
 */
function storeUin() {
    var url = window.location.href;
    var UinM = /\/user\.qzone\.qq\.com\/([\d]+)/;
    var r = UinM.exec(url);
    if (r != null) {
        console.log("uid="+r[1]);
        window.uin = r[1];
    }
}

/**
 * 转换成正式URI，好像实际上没用到
 * 
 * @param {string} 不规范的url
 */
function formalURI(s) {
    if (!(typeof s == "string")) {
        return null;
    }
    if (s.indexOf("//") == 0) {
        s = window.location.protocol + s;
    }
    if (s.indexOf("://") < 1) {
        s = location.protocol + "//" + location.host + (s.indexOf("/") == 0 ? "" : location.pathname.substr(0, location.pathname.lastIndexOf("/") + 1)) + s;
    }
    var depart = s.split("://");
    if (typeof depart == "array" && (depart.length > 1 && /^[a-zA-Z]+$/.test(depart[0]))) {
        this.protocol = depart[0].toLowerCase();
        var h = depart[1].split("/");
        if (typeof h == "array") {
        this.host = h[0];
        this.pathname = "/" + h.slice(1).join("/").replace(/(\?|\#).+/i, "");
        this.href = s;
        var se = depart[1].lastIndexOf("?"), ha = depart[1].lastIndexOf("#");
        this.search = se >= 0 ? depart[1].substring(se) : "";
        this.hash = ha >= 0 ? depart[1].substring(ha) : "";
        if (this.search.length > 0 && this.hash.length > 0) {
            if (ha < se) {
            this.search = "";
            } else {
            this.search = depart[1].substring(se, ha);
            }
        }
        return this;
        } else {
        return null;
        }
    } else {
        return null;
    }
}

/**
 * 生成 g_tk
 * @param {string} url api的URL，好像传null也可以生成可用的g_tk
 */
function gen_gtk(url) {
    url = formalURI(url);
    var skey;
    if (url) {
        if (url.host && url.host.indexOf("qzone.qq.com") > 0) {
            skey = getCookie("p_skey");
        } else {
            if (url.host && url.host.indexOf("qq.com") > 0) {
                skey = getCookie("skey");
            }
        }
    }
    if (!skey) {
        try {
            skey = getCookie("p_skey") || "";
        } catch (err) {
            // 逻辑有问题
            skey = getCookie("p_skey") || "";
        }
    }
    if (!skey) {
        skey = getCookie("skey") || getCookie("rv2");
    }
    var hash = 5381;
    for (var i = 0, len = skey.length;i < len;++i) {
        hash += (hash << 5) + skey.charAt(i).charCodeAt();
    }
    return hash & 2147483647;
}

/**
 * 生成获得日志列表的URL，每次获得10条日志
 *
 * @param {string} uin QQ号
 * @param {integer} page 第几页
 */
function getAbsURL(uin, page) {
    var absURLFmt = "https://h5.qzone.qq.com/proxy/domain/b.qzone.qq.com/cgi-bin/blognew/get_abs?" + 
    "hostUin=%s&uin=%s&blogType=0&cateName=&cateHex=&statYear=&reqInfo=1&pos=%s&num=10&sortType=1" +
    "&absType=0&startTime=&endTime=&source=0&rand=%s&ref=qzone" +
    "&g_tk=%s&verbose=0&anonymous=1&iNotice=0&inCharset=gbk&outCharset=gbk&format=jsonp" +
    "&qzonetoken=%s";

    var absURL = absURLFmt;
    absURL = absURL.replace(/hostUin=%s/, "hostUin="+uin);
    absURL = absURL.replace(/uin=%s/, "uin="+uin);
    absURL = absURL.replace(/pos=%s/, "pos="+page*BLOG_PER_PAGE);
    absURL = absURL.replace(/rand=%s/, "rand="+Math.random());
    absURL = absURL.replace(/g_tk=%s/, "g_tk="+gen_gtk());
    absURL = absURL.replace(/qzonetoken=%s/, "qzonetoken="+window.g_qzonetoken);
    return absURL;
}

/**
 * 生成获得日志页面的URL
 * @param {string} uin QQ号
 * @param {string} blogid 日志ID
 */
function getBlogURL(uin, blogid) {
    var blogURLFmt = "https://h5.qzone.qq.com/proxy/domain/b.qzone.qq.com/cgi-bin/blognew/blog_output_data" +
        "?uin=%s&blogid=%s&styledm=qzonestyle.gtimg.cn&imgdm=qzs.qq.com" +
        "&bdm=b.qzone.qq.com&mode=2&numperpage=50&timestamp=%s&dprefix=&inCharset=gb2312" +
        "&outCharset=gb2312&ref=qzone&page=1" +
        "&refererurl=https%3A%2F%2Fqzs.qq.com%2Fqzone%2Fapp%2Fblog%2Fv6%2Fbloglist.html%23nojump%3D1%26page%3D1%26catalog%3Dlist"

    var blogURL = blogURLFmt;
    blogURL = blogURL.replace(/uin=%s/, "uin="+uin);
    blogURL = blogURL.replace(/blogid=%s/, "blogid="+blogid);
    blogURL = blogURL.replace(/timestamp=%s/, "timestamp="+Math.floor(Date.now() / 1000));
    return blogURL;
}