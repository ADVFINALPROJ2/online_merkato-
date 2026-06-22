export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-stone-500">
          &copy; {new Date().getFullYear()} Digital Merkato. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
