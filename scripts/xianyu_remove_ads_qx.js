/*
 * 闲鱼 App 去广告 - Quantumult X
 * 说明：通用 JSON 清洗脚本，尽量删除信息流广告/开屏/横幅/活动浮层/推广卡片
 * 适用：script-response-body
 * 作者：Minis
 */

function isObj(v) {
  return v && typeof v === 'object' && !Array.isArray(v);
}

function lower(v) {
  return String(v || '').toLowerCase();
}

function hasAdMark(obj) {
  if (!obj || typeof obj !== 'object') return false;

  const text = JSON.stringify(obj).toLowerCase();
  const keys = [
    'ad', 'ads', 'advert', 'advertise', 'advertisement',
    'splash', 'startup', 'banner', 'popup', 'float',
    'promote', 'promotion', 'commercial', 'cm', 'tk_ad',
    'templatead', 'adid', 'aditem', 'adinfo', 'adslot',
    'recommendad', 'insertad', 'launch', 'guanggao', 'gg'
  ];

  const strongTextMarks = [
    '广告', '赞助', '推广', '商业化', '开屏', '闪屏', '横幅', '活动弹窗'
  ];

  if (strongTextMarks.some(k => text.includes(k))) return true;

  for (const k of Object.keys(obj)) {
    const lk = lower(k);
    if (keys.some(x => lk.includes(x))) {
      const v = obj[k];
      if (
        v === true || v === 1 ||
        ['1', 'true', 'yes', 'ad'].includes(lower(v)) ||
        lk.includes('ad') || lk.includes('splash') || lk.includes('banner')
      ) return true;
    }
  }

  const typeFields = ['type', 'cardType', 'itemType', 'templateName', 'templateType', 'bizType', 'styleType'];
  for (const f of typeFields) {
    const val = lower(obj[f]);
    if (!val) continue;
    if (['ad', 'ads', 'banner', 'splash', 'popup', 'float', 'promotion', 'advert'].some(x => val.includes(x))) {
      return true;
    }
    if (['广告', '推广', '开屏', '横幅', '弹窗'].some(x => val.includes(x))) {
      return true;
    }
  }

  return false;
}

function clean(node) {
  if (Array.isArray(node)) {
    const out = [];
    for (const item of node) {
      if (hasAdMark(item)) continue;
      const cleaned = clean(item);
      if (cleaned === undefined) continue;
      out.push(cleaned);
    }
    return out;
  }

  if (!isObj(node)) return node;

  if (hasAdMark(node)) return undefined;

  const removeFields = [
    'ad', 'ads', 'adInfo', 'adInfos', 'adList', 'adItems', 'adSlots',
    'advertisement', 'advertisements', 'promotion', 'promotions',
    'banner', 'banners', 'splash', 'splashAd', 'startup', 'launch',
    'popup', 'popups', 'floatLayer', 'floatWindow', 'operationBanner',
    'activityBanner', 'commercialData', 'insertAds', 'topBanner',
    'bottomBanner', 'bigBanner', 'adCardList'
  ];

  const out = {};
  for (const [k, v] of Object.entries(node)) {
    if (removeFields.includes(k)) continue;
    if (lower(k).includes('ad') || lower(k).includes('banner') || lower(k).includes('splash')) {
      if (isObj(v) || Array.isArray(v)) continue;
    }
    const cleaned = clean(v);
    if (cleaned !== undefined) out[k] = cleaned;
  }

  if (Array.isArray(out.data)) {
    out.data = out.data.filter(x => !hasAdMark(x));
  }
  if (Array.isArray(out.result)) {
    out.result = out.result.filter(x => !hasAdMark(x));
  }
  if (Array.isArray(out.items)) {
    out.items = out.items.filter(x => !hasAdMark(x));
  }
  if (Array.isArray(out.list)) {
    out.list = out.list.filter(x => !hasAdMark(x));
  }

  return out;
}

try {
  const url = $request.url;
  let body = $response.body;

  if (!body || body.length < 2) {
    $done({ body });
  }

  let obj = JSON.parse(body);
  obj = clean(obj);

  if (isObj(obj)) {
    const forceEmpty = [
      'splash', 'startup', 'pop', 'popup', 'floatLayer', 'floatWindow',
      'banners', 'banner', 'adList', 'adInfos', 'ads'
    ];
    forceEmpty.forEach(k => {
      if (k in obj) obj[k] = Array.isArray(obj[k]) ? [] : {};
    });
  }

  console.log('Xianyu ad clean done: ' + url);
  $done({ body: JSON.stringify(obj) });
} catch (e) {
  console.log('Xianyu ad clean error: ' + e);
  $done({ body: $response.body });
}
