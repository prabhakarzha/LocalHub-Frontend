export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-4 mt-8">
      <div className="text-center text-sm">
        © {new Date().getFullYear()} LocalHub. All rights reserved.
      </div>
    </footer>
  );
}
