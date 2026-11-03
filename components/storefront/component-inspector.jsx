import { Plus, Trash2 } from "lucide-react";
import { REGISTRY } from "./component-registry.js";

// The edit form for one component. onChange receives a patch, e.g. { heading: "New" }.
export default function ComponentInspector({ component, onChange }) {
  if (!component) {
    return (
      <div className="inspector">
        <p className="helper-text">Select a component to edit it.</p>
      </div>
    );
  }

  const entry = REGISTRY[component.type];

  return (
    <div className="inspector">
      <h3>Edit {entry.label}</h3>

      {entry.fields.map((field) => {
        const value = component.props[field.key];

        if (field.kind === "textarea") {
          return (
            <label key={field.key}>
              {field.label}
              <textarea value={value} onChange={(e) => onChange({ [field.key]: e.target.value })} />
            </label>
          );
        }

        if (field.kind === "items") {
          const setItem = (index, patch) =>
            onChange({ [field.key]: value.map((it, i) => (i === index ? { ...it, ...patch } : it)) });
          return (
            <div key={field.key} className="items-editor">
              <span className="items-label">{field.label}</span>
              {value.map((it, index) => (
                <div className="item-row" key={index}>
                  <input
                    aria-label={`Product ${index + 1} name`}
                    value={it.name}
                    onChange={(e) => setItem(index, { name: e.target.value })}
                  />
                  <input
                    aria-label={`Product ${index + 1} price`}
                    value={it.price}
                    onChange={(e) => setItem(index, { price: e.target.value })}
                  />
                  <button
                    type="button"
                    className="icon-button"
                    aria-label={`Remove product ${index + 1}`}
                    onClick={() => onChange({ [field.key]: value.filter((_, i) => i !== index) })}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="add-button small"
                onClick={() => onChange({ [field.key]: [...value, { name: "New product", price: "₦0" }] })}
              >
                <Plus size={16} />
                Add product
              </button>
            </div>
          );
        }

        return (
          <label key={field.key}>
            {field.label}
            <input value={value} onChange={(e) => onChange({ [field.key]: e.target.value })} />
          </label>
        );
      })}
    </div>
  );
}
