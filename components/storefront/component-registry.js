// The building blocks. To add a new one: add an entry here and a case in storefront-renderer.jsx.
// fields describe the inspector form. kind is "text", "textarea" or "items".

export const REGISTRY = {
  announcement: {
    label: "Announcement bar",
    defaults: { text: "Free delivery in Lagos on orders over ₦50,000" },
    fields: [{ key: "text", label: "Message", kind: "text" }]
  },
  header: {
    label: "Header",
    defaults: { storeName: "YOUR STORE" },
    fields: [{ key: "storeName", label: "Store name", kind: "text" }]
  },
  hero: {
    label: "Hero",
    defaults: {
      heading: "Thoughtful gifts. Beautifully delivered.",
      description: "Discover something special for someone you love.",
      button: "Explore gifts"
    },
    fields: [
      { key: "heading", label: "Heading", kind: "textarea" },
      { key: "description", label: "Description", kind: "textarea" },
      { key: "button", label: "Button text", kind: "text" }
    ]
  },
  products: {
    label: "Product grid",
    defaults: {
      heading: "Featured products",
      items: [
        { name: "Gift Box One", price: "₦25,000" },
        { name: "Gift Box Two", price: "₦35,000" }
      ]
    },
    fields: [
      { key: "heading", label: "Heading", kind: "text" },
      { key: "items", label: "Products", kind: "items" }
    ]
  },
  productCard: {
    label: "Product card",
    defaults: { name: "Featured box", price: "₦30,000", button: "Add to cart" },
    fields: [
      { key: "name", label: "Name", kind: "text" },
      { key: "price", label: "Price", kind: "text" },
      { key: "button", label: "Button text", kind: "text" }
    ]
  },
  footer: {
    label: "Footer",
    defaults: { text: "© 2026 Your Store. Lagos, Nigeria." },
    fields: [{ key: "text", label: "Text", kind: "text" }]
  }
};

export const TYPES = Object.keys(REGISTRY);

// The page a new visitor starts with.
export const STARTER_TYPES = ["header", "hero", "products"];
