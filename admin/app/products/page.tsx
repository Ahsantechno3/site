"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [sku, setSku] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [category, setCategory] = useState('65f1a2b3c4d5e6f7a8b9c0d1'); // Dummy Object ID for now

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/products');
            setProducts(res.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newProduct = {
                name,
                slug,
                sku,
                description,
                price: Number(price),
                stock: Number(stock),
                category
            };
            await axios.post('http://localhost:5000/api/products', newProduct);
            fetchProducts(); // Refresh list
            // Clear form
            setName(''); setSlug(''); setSku(''); setDescription(''); setPrice(''); setStock('');
            alert('Product created successfully!');
        } catch (error) {
            console.error('Error creating product:', error);
            alert('Error creating product.');
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Products</h1>
            
            <div className="bg-white p-4 rounded shadow mb-6 text-black">
                <h2 className="text-xl mb-4">Add New Product</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="border p-2 w-full" required />
                    </div>
                    <div>
                        <input type="text" placeholder="Slug" value={slug} onChange={e => setSlug(e.target.value)} className="border p-2 w-full" required />
                    </div>
                    <div>
                        <input type="text" placeholder="SKU" value={sku} onChange={e => setSku(e.target.value)} className="border p-2 w-full" required />
                    </div>
                    <div>
                        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="border p-2 w-full" required />
                    </div>
                    <div>
                        <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} className="border p-2 w-full" required />
                    </div>
                    <div>
                        <input type="number" placeholder="Stock" value={stock} onChange={e => setStock(e.target.value)} className="border p-2 w-full" required />
                    </div>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save Product</button>
                </form>
            </div>

            <div className="bg-white p-4 rounded shadow text-black">
                <h2 className="text-xl mb-4">Product List</h2>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th className="border-b p-2">Name</th>
                            <th className="border-b p-2">SKU</th>
                            <th className="border-b p-2">Price</th>
                            <th className="border-b p-2">Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product._id}>
                                <td className="border-b p-2">{product.name}</td>
                                <td className="border-b p-2">{product.sku}</td>
                                <td className="border-b p-2">${product.price}</td>
                                <td className="border-b p-2">{product.stock}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

