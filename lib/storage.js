import { isValidPage } from "./page-model.js";
import { REGISTRY } from "../components/storefront/component-registry.js";

const KEY = "storefront-page-v1";

// Every saved component must have the props its renderer expects.
function hasExpectedProps(page) {
  return page.components.every((item) => {
    const defaults = REGISTRY[item.type].defaults;
    return Object.keys(defaults).every((key) =>
      Array.isArray(defaults[key])
        ? Array.isArray(item.props[key]) && item.props[key].every((x) => x && typeof x === "object")
        : typeof item.props[key] === typeof defaults[key]
    );
  });
}

// Returns the saved page, or null if nothing valid is saved.
export function loadPage(knownTypes) {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return isValidPage(parsed, knownTypes) && hasExpectedProps(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function savePage(page) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(page));
  } catch {
    // Storage can be full or blocked. The editor keeps working without it.
  }
}

export function clearPage() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // Nothing to do.
  }
}
