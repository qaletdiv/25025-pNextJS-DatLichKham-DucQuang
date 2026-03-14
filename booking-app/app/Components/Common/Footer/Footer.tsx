export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-400 py-4 mt-10">
      <div className="container mx-auto text-center">
        <p>
          &copy; {new Date().getFullYear()} Booking App. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
