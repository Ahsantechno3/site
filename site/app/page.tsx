'use client';
import { useState } from 'react';

const products = [
 { name:'Form carry-all', type:'Bags', price:'$128', image:'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80' },
 { name:'Stoneware mug', type:'Kitchen', price:'$32', image:'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80' },
 { name:'Linen throw', type:'Home', price:'$86', image:'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=900&q=80' },
 { name:'Daily journal', type:'Paper', price:'$24', image:'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=80' },
];
export default function HomePage() {
 const [cart, setCart] = useState(0); const [menu, setMenu] = useState(false);
 return <main>
  <div className="bg-[var(--green)] px-5 py-2 text-center text-sm text-white">Complimentary shipping on orders over $100</div>
  <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 md:px-10">
   <button className="text-sm md:hidden" onClick={()=>setMenu(!menu)}>Menu</button><a className="text-2xl font-bold tracking-[-.06em]" href="#top">morrow<span className="text-[var(--orange)]">.</span></a>
   <nav className={`${menu?'flex':'hidden'} absolute left-0 top-24 z-10 w-full flex-col gap-4 bg-[var(--cream)] px-5 py-5 text-sm md:static md:flex md:w-auto md:flex-row md:bg-transparent md:p-0`}><a href="#shop">Shop</a><a href="#story">Our story</a><a href="#journal">Journal</a></nav>
   <button className="text-sm" onClick={()=>setCart(cart+1)}>Bag ({cart})</button>
  </header>
  <section id="top" className="mx-auto grid max-w-7xl gap-8 px-5 pb-20 pt-8 md:grid-cols-[1.05fr_.95fr] md:px-10 md:pt-16">
   <div className="flex flex-col justify-center"><p className="mb-6 text-sm uppercase tracking-[.18em] text-[var(--orange)]">Objects for a considered life</p><h1 className="max-w-xl text-6xl font-medium leading-[.94] tracking-[-.07em] md:text-8xl">Make space for good things.</h1><p className="mt-8 max-w-md text-lg leading-7 text-[var(--muted)]">A small collection of useful, beautiful objects designed to live with you for a long time.</p><a href="#shop" className="mt-10 w-fit rounded-full bg-[var(--ink)] px-7 py-4 text-sm text-white transition hover:bg-[var(--green)]">Explore the collection →</a></div>
   <div className="min-h-[440px] rounded-[2rem] bg-[url('https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1200&q=85')] bg-cover bg-center md:min-h-[590px]" />
  </section>
  <section id="shop" className="mx-auto max-w-7xl px-5 py-20 md:px-10"><div className="mb-10 flex items-end justify-between"><div><p className="mb-3 text-sm uppercase tracking-[.18em] text-[var(--orange)]">The collection</p><h2 className="text-4xl tracking-[-.05em] md:text-5xl">Made to be used.</h2></div><a className="hidden text-sm underline md:block" href="#shop">View all products</a></div><div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-6">{products.map((p)=><article key={p.name}><button className="group block w-full text-left" onClick={()=>setCart(cart+1)}><div className="mb-4 aspect-[.82] overflow-hidden rounded-2xl bg-[var(--sage)]"><img src={p.image} alt={p.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /></div><p className="text-xs uppercase tracking-wider text-[var(--muted)]">{p.type}</p><div className="mt-2 flex justify-between gap-2 text-sm"><h3>{p.name}</h3><span>{p.price}</span></div></button></article>)}</div></section>
  <section id="story" className="bg-[var(--sage)] px-5 py-24 md:px-10"><div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2"><p className="text-sm uppercase tracking-[.18em] text-[var(--green)]">Why morrow</p><div><h2 className="max-w-2xl text-4xl leading-tight tracking-[-.05em] md:text-6xl">Less, but better. We choose objects with a reason to exist.</h2><p className="mt-8 max-w-lg leading-7 text-[var(--muted)]">Thoughtfully sourced materials, honest forms, and details you notice over time. No seasonal churn, just things worth keeping.</p></div></div></section>
  <footer id="journal" className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-12 text-sm md:flex-row md:items-center md:justify-between md:px-10"><p className="font-bold tracking-[-.04em]">morrow<span className="text-[var(--orange)]">.</span></p><p className="text-[var(--muted)]">© 2026 Morrow Studio. Built for the everyday.</p><div className="flex gap-5"><a href="#shop">Instagram</a><a href="#story">Contact</a></div></footer>
 </main>;
}
