/**
 * Thin helpers for cookies and JSON in localStorage / sessionStorage.
 */
function getCookie(name) {
  const match = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)')
  );
  return match ? decodeURIComponent(match[1]) : '';
}

function setCookie(name, value, maxAgeDays) {
  const maxAge = Math.floor(maxAgeDays * 24 * 60 * 60);
  document.cookie =
    encodeURIComponent(name) +
    '=' +
    encodeURIComponent(value) +
    ';path=/;max-age=' +
    maxAge +
    ';SameSite=Lax';
}

function deleteCookie(name) {
  document.cookie = encodeURIComponent(name) + '=;path=/;max-age=0;SameSite=Lax';
}

function loadJSON(storage, key, fallback) {
  try {
    const raw = storage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function saveJSON(storage, key, value) {
  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
