"use client";

import { useEffect, useState } from "react";
import { Plus, Smartphone, Layers, Eye, EyeOff, ArrowUp, ArrowDown, Copy, Trash2 } from "lucide-react";
import "./editor.css";
import { REGISTRY, TYPES, STARTER_TYPES } from "../components/storefront/component-registry.js";
import StorefrontRenderer from "../components/storefront/storefront-renderer.jsx";
import ComponentInspector from "../components/storefront/component-inspector.jsx";
import {
  createPage,
  createComponent,
  addComponent,
  updateComponent,
  duplicateComponent,
  deleteComponent,
  moveComponent,
  getComponent
} from "../lib/page-model.js";
import { loadPage, savePage, clearPage } from "../lib/storage.js";

function starterPage() {
  return createPage(STARTER_TYPES.map((type) => createComponent(type, REGISTRY[type].defaults)));
}

export default function Home() {
  const [page, setPage] = useState(() => starterPage());
  const [selectedId, setSelectedId] = useState(null);
  const [preview, setPreview] = useState(false);
  const [newType, setNewType] = useState("hero");
  const [loaded, setLoaded] = useState(false);

  // Restore the saved page after the first render, so server and browser HTML match.
  useEffect(() => {
    const saved = loadPage(TYPES);
    if (saved) {
      setPage(saved);
      setSelectedId(saved.components[0]?.id ?? null);
    } else {
      setSelectedId((id) => id ?? page.components[0]?.id ?? null);
    }
    setLoaded(true);
  }, []);

  // Save every change, but only after the restore has run.
  useEffect(() => {
    if (loaded) savePage(page);
  }, [page, loaded]);

  const selected = getComponent(page, selectedId);
  const items = page.components;

  const add = () => {
    const created = createComponent(newType, REGISTRY[newType].defaults);
    setPage((prev) => addComponent(prev, created, selectedId));
    setSelectedId(created.id);
  };

  const duplicate = (id) => {
    const before = new Set(items.map((item) => item.id));
    const next = duplicateComponent(page, id);
    const copy = next.components.find((item) => !before.has(item.id));
    setPage(next);
    if (copy) setSelectedId(copy.id);
  };

  const remove = (id) => {
    const index = items.findIndex((item) => item.id === id);
    const next = deleteComponent(page, id);
    setPage(next);
    if (id === selectedId) {
      setSelectedId(next.components[Math.min(index, next.components.length - 1)]?.id ?? null);
    }
  };

  const reset = () => {
    clearPage();
    const fresh = starterPage();
    setPage(fresh);
    setSelectedId(fresh.components[0].id);
  };
  if (!loaded) return <main className="workspace" />;
  if (preview) {
    return (
      <main className="workspace">
        <header className="topbar">
          <div>
            <span className="eyebrow">PREVIEW</span>
            <h1>Your storefront</h1>
          </div>
          <button className="preview-button" onClick={() => setPreview(false)}>
            <EyeOff size={16} />
            Back to editing
          </button>
        </header>
        <div className="preview-wrap">
          <div className="phone">
            <StorefrontRenderer components={items} />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="workspace">
      <header className="topbar">
        <div>
          <span className="eyebrow">DESIGN STUDIO</span>
          <h1>Drawing Board</h1>
        </div>
        <button className="preview-button" onClick={() => setPreview(true)}>
          <Eye size={16} />
          Preview
        </button>
      </header>

      <section className="canvas-section">
        <div className="canvas-heading">
          <span><Smartphone size={16} /> MOBILE CANVAS</span>
          <span>375 × 812</span>
        </div>
        <div className="phone">
          <StorefrontRenderer components={items} selectedId={selectedId} onSelect={setSelectedId} />
        </div>
      </section>

      <section className="editor">
        <div className="editor-heading">
          <Layers size={19} />
          <h2>Components</h2>
        </div>

        <div className="component-list">
          {items.map((item, index) => (
            <div className="component-row" key={item.id}>
              <button
                className={`name ${item.id === selectedId ? "active" : ""}`}
                onClick={() => setSelectedId(item.id)}
              >
                {REGISTRY[item.type].label}
              </button>
              <button className="icon-button" aria-label="Move up" disabled={index === 0}
                onClick={() => setPage((prev) => moveComponent(prev, item.id, -1))}>
                <ArrowUp size={15} />
              </button>
              <button className="icon-button" aria-label="Move down" disabled={index === items.length - 1}
                onClick={() => setPage((prev) => moveComponent(prev, item.id, 1))}>
                <ArrowDown size={15} />
              </button>
              <button className="icon-button" aria-label="Duplicate" onClick={() => duplicate(item.id)}>
                <Copy size={15} />
              </button>
              <button className="icon-button" aria-label="Delete" onClick={() => remove(item.id)}>
                <Trash2 size={15} />
              </button>
            </div>
          ))}
          {items.length === 0 && <p className="helper-text">The page is empty. Add a component below.</p>}
        </div>

        <ComponentInspector
          component={selected}
          onChange={(patch) => setPage((prev) => updateComponent(prev, selectedId, patch))}
        />

        <div className="add-row">
          <select aria-label="Component type" value={newType} onChange={(e) => setNewType(e.target.value)}>
            {TYPES.map((type) => (
              <option key={type} value={type}>{REGISTRY[type].label}</option>
            ))}
          </select>
          <button className="add-button" onClick={add}>
            <Plus size={18} />
            Add component
          </button>
        </div>

        <button className="reset-button" onClick={reset}>Reset to starter page</button>
      </section>
    </main>
  );
}

