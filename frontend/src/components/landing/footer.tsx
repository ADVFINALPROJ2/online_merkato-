export const Footer = () => {
  return (
    // PARENT: Full width, background color applied here
    <footer className="bg-[#f4f7fb] w-full py-16 mt-12">
      {/* CHILD: Max width, keeps content aligned with the rest of your page */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Brand Column */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Digital Merkato</h2>
          <p className="text-gray-600 leading-relaxed">
            Bringing Ethiopia's iconic marketplaces online buy, sell, and deliver with ease.
          </p>
        </div>

        {/* Shop Column */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Shop</h3>
          <ul className="space-y-2 text-gray-600">
            <li><a href="/products" className="hover:text-blue-600">All products</a></li>
            <li><a href="/cart" className="hover:text-blue-600">Cart</a></li>
            <li><a href="/orders" className="hover:text-blue-600">My orders</a></li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Contact</h3>
          <div className="space-y-2 text-gray-600">
            <p>support@digitalmerkato.et</p>
            <p>+251 11 000 0000</p>
          </div>
        </div>
      </div>

      {/* Centered Copyright */}
      <div className="text-center text-sm text-gray-500 mt-16 px-6">
        © 2026 Digital Merkato Ethiopia. All rights reserved.
      </div>
    </footer>
  );
};