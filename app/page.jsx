"use client";

import { useState } from "react";
import {
  ShoppingBag,
  Plus,
  Smartphone,
  Layers,
  Pencil,
  Eye
} from "lucide-react";

export default function Home() {
  const [selected, setSelected] = useState("hero");

  const [content, setContent] = useState({
    storeName: "YOUR STORE",
    heading: "Thoughtful gifts. Beautifully delivered.",
    description: "Discover something special for someone you love.",
    button: "Explore gifts"
  });

  const updateContent = (field, value) => {
    setContent((previous) => ({
      ...previous,
      [field]: value
    }));
  };

  const components = [
    { id: "header", name: "Header" },
    { id: "hero", name: "Hero" },
    { id: "products", name: "Product grid" }
  ];

  return (
    <main className="workspace">
      <header className="topbar">
        <div>
          <span className="eyebrow">DESIGN STUDIO</span>
          <h1>Drawing Board</h1>
        </div>
        <button className="preview-button">
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
          <div
            className={`store-header ${
              selected === "header" ? "selected" : ""
            }`}
            onClick={() => setSelected("header")}
          >
            <strong>{content.storeName}</strong>
            <ShoppingBag size={21} />
          </div>

          <div
            className={`hero ${
              selected === "hero" ? "selected" : ""
            }`}
            onClick={() => setSelected("hero")}
          >
            <span className="component-label">HERO SECTION</span>
            <h2>{content.heading}</h2>
            <p>{content.description}</p>
            <button className="shop-button">
              {content.button}
            </button>
          </div>

          <div
            className={`products ${
              selected === "products" ? "selected" : ""
            }`}
            onClick={() => setSelected("products")}
          >
            <span className="component-label">PRODUCT GRID</span>
            <h3>Featured products</h3>

            <div className="product-grid">
              <div className="product">
                <div className="product-image" />
                <strong>Gift Box One</strong>
                <span>₦25,000</span>
              </div>

              <div className="product">
                <div className="product-image" />
                <strong>Gift Box Two</strong>
                <span>₦35,000</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="editor">
        <div className="editor-heading">
          <Layers size={19} />
          <h2>Components</h2>
        </div>

        <div className="component-list">
          {components.map((component) => (
            <button
              key={component.id}
              className={
                selected === component.id ? "active" : ""
              }
              onClick={() => setSelected(component.id)}
            >
              {component.name}
              <Pencil size={15} />
            </button>
          ))}
        </div>

        <div className="inspector">
          <h3>Edit {components.find(
            (item) => item.id === selected
          )?.name}</h3>

          {selected === "header" && (
            <label>
              Store name
              <input
                value={content.storeName}
                onChange={(e) =>
                  updateContent("storeName", e.target.value)
                }
              />
            </label>
          )}

          {selected === "hero" && (
            <>
              <label>
                Heading
                <textarea
                  value={content.heading}
                  onChange={(e) =>
                    updateContent("heading", e.target.value)
                  }
                />
              </label>

              <label>
                Description
                <textarea
                  value={content.description}
                  onChange={(e) =>
                    updateContent("description", e.target.value)
                  }
                />
              </label>

              <label>
                Button text
                <input
                  value={content.button}
                  onChange={(e) =>
                    updateContent("button", e.target.value)
                  }
                />
              </label>
            </>
          )}

          {selected === "products" && (
            <p className="helper-text">
              Product editing will be added in the next version.
            </p>
          )}
        </div>

        <button className="add-button" onClick={() =>
          setSelected("products")
        }>
          <Plus size={18} />
          Add component
        </button>
      </section>
    </main>
  );
}