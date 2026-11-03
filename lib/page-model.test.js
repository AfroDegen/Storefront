import test from "node:test";
import assert from "node:assert/strict";
import {
  createPage, createComponent, addComponent, updateComponent,
  duplicateComponent, deleteComponent, moveComponent, isValidPage
} from "./page-model.js";
import { REGISTRY, TYPES } from "../components/storefront/component-registry.js";

const make = (type) => createComponent(type, REGISTRY[type].defaults);

test("acceptance: two heroes, edit one, delete one, reorder, restore", () => {
  let page = createPage([make("header")]);
  const heroA = make("hero");
  const heroB = make("hero");
  page = addComponent(page, heroA);
  page = addComponent(page, heroB);
  assert.equal(page.components.filter((c) => c.type === "hero").length, 2);

  page = updateComponent(page, heroA.id, { heading: "First" });
  page = updateComponent(page, heroB.id, { heading: "Second" });
  assert.equal(page.components[1].props.heading, "First");
  assert.equal(page.components[2].props.heading, "Second");

  page = updateComponent(page, heroA.id, { heading: "First, edited" });
  assert.equal(page.components[2].props.heading, "Second");

  page = deleteComponent(page, heroB.id);
  assert.equal(page.components.length, 2);

  page = moveComponent(page, heroA.id, -1);
  assert.deepEqual(page.components.map((c) => c.type), ["hero", "header"]);

  const restored = JSON.parse(JSON.stringify(page));
  assert.ok(isValidPage(restored, TYPES));
  assert.deepEqual(restored, page);
});

test("duplicate gives a new id and independent props", () => {
  let page = createPage([make("products")]);
  const originalId = page.components[0].id;
  page = duplicateComponent(page, originalId);
  assert.equal(page.components.length, 2);
  assert.notEqual(page.components[0].id, page.components[1].id);
  page = updateComponent(page, page.components[1].id, { heading: "Changed" });
  assert.notEqual(page.components[0].props.heading, "Changed");
  page.components[1].props.items.push({ name: "x", price: "y" });
  assert.equal(page.components[0].props.items.length, 2);
});

test("defaults are copied, not shared", () => {
  const a = make("hero");
  a.props.heading = "Mutated";
  assert.notEqual(REGISTRY.hero.defaults.heading, "Mutated");
});

test("move stops at the ends and add inserts after the selection", () => {
  const a = make("header"), b = make("hero"), c = make("footer");
  let page = createPage([a, b, c]);
  assert.equal(moveComponent(page, a.id, -1), page);
  assert.equal(moveComponent(page, c.id, 1), page);
  const d = make("announcement");
  page = addComponent(page, d, a.id);
  assert.deepEqual(page.components.map((x) => x.id), [a.id, d.id, b.id, c.id]);
});

test("invalid stored data is rejected", () => {
  assert.equal(isValidPage(null, TYPES), false);
  assert.equal(isValidPage({ version: 1, components: [{ id: "a", type: "nope", props: {} }] }, TYPES), false);
  assert.equal(isValidPage({ version: 1, components: [{ id: "a", type: "hero", props: {} }, { id: "a", type: "hero", props: {} }] }, TYPES), false);
  assert.equal(isValidPage({ version: 2, components: [] }, TYPES), false);
});
