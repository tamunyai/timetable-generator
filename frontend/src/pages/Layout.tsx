import { Link } from "react-router-dom";

type LayoutProps = {
  title?: string;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ title, children, headerRight }) => {
  document.title = `${title ? title + " :: " : ""}Timetable Generator`;

  return (
    <main>
      <header className="top-0 z-50 sticky flex justify-between items-center bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur mx-auto px-4 py-4 border-b max-w-5xl">
        <Link
          to="/"
          className="flex items-center space-x-2 text-gray-800 hover:text-blue-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide-table2-icon lucide-table-2 lucide"
          >
            <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
          </svg>
          <span className="font-semibold text-lg">Timetable Generator</span>
        </Link>

        {headerRight && headerRight}
      </header>

      {children}
    </main>
  );
};

export default Layout;
