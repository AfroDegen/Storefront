import { ShoppingBag } from "lucide-react";
import { REGISTRY } from "./component-registry.js";

// Renders the page model. With onSelect it is the editing canvas.
// Without it, it is the clean preview.
export default function StorefrontRenderer({ components, selectedId, onSelect }) {
  const editing = typeof onSelect === "function";

  return (
    <>
      {components.map((item) => {
        const selected = editing && item.id === selectedId;
        const wrapperProps = editing
          ? { onClick: () => onSelect(item.id), "data-selected": selected ? "true" : undefined }
          : {};
        const cls = (name) => `${name} ${selected ? "selected" : ""}`;
        const label = editing ? (
          <span className="component-label">{REGISTRY[item.type].label.toUpperCase()}</span>
        ) : null;
        const p = item.props;

        switch (item.type) {
          case "announcement":
            return (
              <div key={item.id} className={cls("announcement")} {...wrapperProps}>
                {p.text}
              </div>
            );
          case "header":
            return (
              <div key={item.id} className={cls("store-header")} {...wrapperProps}>
                <strong>{p.storeName}</strong>
                <ShoppingBag size={21} />
              </div>
            );
          case "hero":
            return (
              <div key={item.id} className={cls("hero")} {...wrapperProps}>
                {label}
                <h2>{p.heading}</h2>
                <p>{p.description}</p>
                <button className="shop-button">{p.button}</button>
              </div>
            );
          case "products":
            return (
              <div key={item.id} className={cls("products")} {...wrapperProps}>
                {label}
                <h3>{p.heading}</h3>
                <div className="product-grid">
                  {p.items.map((product, index) => (
                    <div className="product" key={index}>
                      <div className="product-image" />
                      <strong>{product.name}</strong>
                      <span>{product.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          case "productCard":
            return (
              <div key={item.id} className={cls("product-card")} {...wrapperProps}>
                {label}
                <div className="product-image" />
                <strong>{p.name}</strong>
                <span>{p.price}</span>
                <button className="shop-button">{p.button}</button>
              </div>
            );
          case "footer":
            return (
              <div key={item.id} className={cls("store-footer")} {...wrapperProps}>
                {p.text}
              </div>
            );
          default:
            return null;
        }
      })}
    </>
  );
}
