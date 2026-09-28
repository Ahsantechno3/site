// /app/[pages]/layout.tsx
import { notFound } from "next/navigation";

const allowedPages = ["products", "customers", "orders", "categories", "coupons", "reviews", "media","brands"];

export default async function PagesLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ pages: string }>; 
}) {
  const { pages } = await params;

  if (!allowedPages.includes(pages)) {

    notFound(); 
  }

  return (
    <div className="flex min-h-screen w-full gap-3">

      <main className="min-w-0 flex-1">
        {children}
      </main>
    </div>
  );
}