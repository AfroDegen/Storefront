// The storefront is data: { version, components: [{ id, type, props }] }.
// Every function here is pure. It takes a page and returns a new page.

export const PAGE_VERSION = 1;

let counter = 0;
export function createId(type) {
  counter += 1;
  return `${type}-${Date.now().toString(36)}${counter.toString(36)}${Math.random()
    .toString(36)
    .slice(2, 5)}`;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function createComponent(type, defaults) {
  return { id: createId(type), type, props: clone(defaults) };
}

export function createPage(components = []) {
  return { version: PAGE_VERSION, components };
}

export function findIndex(page, id) {
  return page.components.findIndex((item) => item.id === id);
}

export function getComponent(page, id) {
  return page.components.find((item) => item.id === id) || null;
}

// Add after the component with id `afterId`. With no afterId, add at the end.
export function addComponent(page, component, afterId) {
  const at = afterId ? findIndex(page, afterId) : -1;
  const index = at === -1 ? page.components.length : at + 1;
  const components = [...page.components];
  components.splice(index, 0, component);
  return { ...page, components };
}

// Change props of one component only. Other components are untouched.
export function updateComponent(page, id, patch) {
  return {
    ...page,
    components: page.components.map((item) =>
      item.id === id ? { ...item, props: { ...item.props, ...patch } } : item
    )
  };
}

// The copy gets its own id and its own copy of the props, placed right after the original.
export function duplicateComponent(page, id) {
  const index = findIndex(page, id);
  if (index === -1) return page;
  const original = page.components[index];
  const copy = { id: createId(original.type), type: original.type, props: clone(original.props) };
  const components = [...page.components];
  components.splice(index + 1, 0, copy);
  return { ...page, components };
}

export function deleteComponent(page, id) {
  return { ...page, components: page.components.filter((item) => item.id !== id) };
}

// direction: -1 moves up, 1 moves down. Stops at the ends.
export function moveComponent(page, id, direction) {
  const from = findIndex(page, id);
  const to = from + direction;
  if (from === -1 || to < 0 || to >= page.components.length) return page;
  const components = [...page.components];
  const [item] = components.splice(from, 1);
  components.splice(to, 0, item);
  return { ...page, components };
}

// Check data that came from storage. Unknown types and bad shapes are rejected.
export function isValidPage(value, knownTypes) {
  if (!value || typeof value !== "object") return false;
  if (value.version !== PAGE_VERSION) return false;
  if (!Array.isArray(value.components)) return false;
  const seen = new Set();
  for (const item of value.components) {
    if (!item || typeof item.id !== "string" || seen.has(item.id)) return false;
    if (!knownTypes.includes(item.type)) return false;
    if (!item.props || typeof item.props !== "object") return false;
    seen.add(item.id);
  }
  return true;
}
