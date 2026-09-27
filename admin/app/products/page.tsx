"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

type Product = {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  price: number;
  stock: number;
  status: "active" | "inactive" | "draft";
  featured?: boolean;
};

type ProductForm = Omit<Product, "_id" | "status" | "featured"> & { status: Product["status"] };
const emptyForm: ProductForm = { name: "", slug: "", sku: "", description: "", price: 0, stock: 0, status: "draft" };

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiBase}/products?status=all&limit=100`, { cache: "no-store" });
      if (!response.ok) throw new Error("Unable to load products");
      const data = await response.json();
      setProducts(data.products ?? []);
    } catch {
      setStatus("Could not connect to the ecommerce API.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchProducts(); }, [fetchProducts]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(editingId ? "Updating product..." : "Creating product...");
    const response = await fetch(`${apiBase}/products${editingId ? `/${editingId}` : ""}`, {
      method: editingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, price: Number(form.price), stock: Number(form.stock) }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      setStatus(error.message ?? "Product could not be saved.");
      return;
    }
    setForm(emptyForm);
    setEditingId(null);
    await fetchProducts();
    setStatus(editingId ? "Product updated." : "Product created.");
  }

  function editProduct(product: Product) {
    setEditingId(product._id);
    setForm({ name: product.name, slug: product.slug, sku: product.sku, description: product.description, price: product.price, stock: product.stock, status: product.status });
  }

  async function archiveProduct(id: string) {
    if (!window.confirm("Archive this product?")) return;
    const response = await fetch(`${apiBase}/products/${id}`, { method: "DELETE" });
    if (response.ok) { await fetchProducts(); setStatus("Product archived."); }
  }

  return (
    <main className="p-6">
      <div className="mb-6 flex items-center justify-between gap-4"><div><h1 className="text-2xl font-bold">Products</h1><p className="text-sm opacity-70">Manage the catalog connected to the production API.</p></div><span className="rounded-full bg-black/10 px-3 py-1 text-sm">{products.length} products</span></div>
      <section className="mb-6 rounded-lg bg-white p-5 text-black shadow">
        <h2 className="mb-4 text-xl font-semibold">{editingId ? "Edit product" : "Add new product"}</h2>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          {(["name", "slug", "sku"] as const).map((field) => <input key={field} required placeholder={field[0].toUpperCase() + field.slice(1)} value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} className="rounded border p-2" />)}
          <input required min="0" step="0.01" type="number" placeholder="Price" value={form.price} onChange={(event) => setForm({ ...form, price: Number(event.target.value) })} className="rounded border p-2" />
          <input required min="0" type="number" placeholder="Stock" value={form.stock} onChange={(event) => setForm({ ...form, stock: Number(event.target.value) })} className="rounded border p-2" />
          <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as Product["status"] })} className="rounded border p-2"><option value="draft">Draft</option><option value="active">Active</option><option value="inactive">Inactive</option></select>
          <textarea required placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="rounded border p-2 md:col-span-2" />
          <div className="flex gap-3"><button type="submit" className="rounded bg-black px-4 py-2 text-white">{editingId ? "Update product" : "Save product"}</button>{editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="rounded border px-4 py-2">Cancel</button>}<p className="self-center text-sm text-gray-600" role="status">{status}</p></div>
        </form>
      </section>
      <section className="rounded-lg bg-white p-5 text-black shadow"><h2 className="mb-4 text-xl font-semibold">Product list</h2>{loading ? <p>Loading products...</p> : <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b"><th className="p-2">Name</th><th className="p-2">SKU</th><th className="p-2">Price</th><th className="p-2">Stock</th><th className="p-2">Status</th><th className="p-2">Actions</th></tr></thead><tbody>{products.map((product) => <tr key={product._id} className="border-b"><td className="p-2">{product.name}</td><td className="p-2">{product.sku}</td><td className="p-2">${product.price.toFixed(2)}</td><td className="p-2">{product.stock}</td><td className="p-2">{product.status}</td><td className="flex gap-2 p-2"><button onClick={() => editProduct(product)} className="rounded border px-2 py-1 text-sm">Edit</button><button onClick={() => archiveProduct(product._id)} className="rounded border px-2 py-1 text-sm">Archive</button></td></tr>)}</tbody></table>{products.length === 0 && <p className="py-6 text-center text-gray-500">No products found.</p>}</div>}</section>
    </main>
  );
}
