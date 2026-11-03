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
    
