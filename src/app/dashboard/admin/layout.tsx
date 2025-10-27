import Link from 'next/link';
import { LayoutDashboard, Package, Users, ShoppingCart } from 'lucide-react'; // Add Users icon

// This is an example layout. Your file might be different.
// The key is to add the new Link to the navigation list.

const adminNavLinks = [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/partners', label: 'Partners', icon: Users }, // <-- ADD THIS LINE
    { href: '/admin/abandoned-carts', label: 'Abandoned Carts', icon: ShoppingCart },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen">
            <aside className="w-64 bg-gray-800 text-white p-4">
                <h2 className="text-xl font-bold mb-8">Admin Panel</h2>
                <nav className="space-y-2">
                    {adminNavLinks.map(link => (
                        <Link key={link.href} href={link.href} className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                           <link.icon size={18} />
                           {link.label}
                        </Link>
                    ))}
                </nav>
            </aside>
            <main className="flex-1 bg-gray-100">
                {children}
            </main>
        </div>
    );
}