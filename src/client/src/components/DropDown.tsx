/* Adapted from: https://tailwindcss.com/plus/ui-blocks/application-ui/elements/dropdowns */
import { useState, JSX } from "react";

function DropDownMenu(): JSX.Element {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          id="menu-button"
          aria-expanded={isMenuOpen}
          aria-haspopup="true"
          onClick={toggleMenu}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4 mx-auto"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.75a.75.75 0 100-1.5.75.75 0 000 1.5zm0 6a.75.75 0 100-1.5.75.75 0 000 1.5zm0 6a.75.75 0 100-1.5.75.75 0 000 1.5z"
            />
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <div
          className="absolute right-0 z-10 mt-2 w-40 origin-top-right bg-white shadow-lg ring-1 ring-black/5 focus:outline-hidden text-right"
          style={{ direction: "rtl" }}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex={-1}
        >
          <div className="py-1" role="none">
            <a
              href="#"
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              role="menuitem"
              tabIndex={-1}
              id="menu-item-0"
            >
              Download<span className="mr-2">⬇️</span>
            </a>
            <a
              href="#"
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              role="menuitem"
              tabIndex={-1}
              id="menu-item-1"
            >
              Rename<span className="mr-2">✏️</span>
            </a>
            <a
              href="#"
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              role="menuitem"
              tabIndex={-1}
              id="menu-item-2"
            >
              Move<span className="mr-2">Ⓜ️</span>
            </a>
            <a
              href="#"
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              role="menuitem"
              tabIndex={-1}
              id="menu-item-3"
            >
              Delete<span className="mr-2">🗑️</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default DropDownMenu;
