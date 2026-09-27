"use client";

import { FormEvent, useEffect, useState } from "react";

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "/api";

type Product = {
  _id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({ name: "", slug: "", sku: "", description: "", price: "", stock: "" });
  const [status, setStatus] = useState("");

  async function fetchProducts() {
    const response = await fetch(`${apiBase}/products`, { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to load products");
    const data = await response.json();
    setProducts(Array.isArray(data) ? data : data.products ?? []);
  }

  useEffect(() => {
    fetchProducts().catch(() => setStatus("Connect the API to load products."));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Saving product...");
    const response = await fetch(`${apiBase}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, price: Number(form.price), stock: Number(form.stock) }),
    });
    if (!response.ok) {
      setStatus("Product could not be saved.");
      return;
    }
    setForm({ name: "", slug: "", sku: "", description: "", price: "", stock: "" });
    await fetchProducts();
    setStatus("Product saved.");
  }

  return (
    <main className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Products</h1>
      <section className="mb-6 rounded-lg bg-white p-5 text-black shadow">
        <h2 className="mb-4 text-xl font-semibold">Add new product</h2>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          {(["name", "slug", "sku", "price", "stock"] as const).map((field) => (
            <input key={field} required type={field === "price" || field === "stock" ? "number" : "text"} placeholder={field[0].toUpperCase() + field.slice(1)} value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} className="rounded border p-2" />
          ))}
          <textarea required placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="rounded border p-2 md:col-span-2" />
          <button type="submit" className="rounded bg-black px-4 py-2 text-white md:w-fit">Save product</button>
          {status && <p className="self-center text-sm text-gray-600" role="status">{status}</p>}
        </form>
      </section>
      <section className="rounded-lg bg-white p-5 text-black shadow">
        <h2 className="mb-4 text-xl font-semibold">Product list</h2>
        <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b"><th className="p-2">Name</th><th className="p-2">SKU</th><th className="p-2">Price</th><th className="p-2">Stock</th></tr></thead><tbody>{products.map((product) => <tr key={product._id} className="border-b"><td className="p-2">{product.name}</td><td className="p-2">{product.sku}</td><td className="p-2">${product.price}</td><td className="p-2">{product.stock}</td></tr>)}</tbody></table></div>
      </section>
    </main>
  );
}
