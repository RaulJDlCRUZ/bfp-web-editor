/* Adapted from: https://tailwindcss.com/plus/ui-blocks/application-ui/elements/dropdowns */
import { useState, JSX } from "react";

function NavBarDropDown(): JSX.Element {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex w-full justify-center gap-x-1.5 rounded-sm bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={toggleMenu}
        >
          Options
          <svg
            className={`-mr-1 size-5 text-gray-400 transform ${
              isMenuOpen ? "rotate-180" : ""
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            data-slot="icon"
          >
            <path
              fillRule="evenodd"
              d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <div
          className="absolute right-0 z-10 mt-4 w-56 origin-top-right rounded-sm bg-white shadow-lg ring-1 ring-black/5 focus:outline-hidden"
          style={{ direction: "rtl" }}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex={-1}
        >
          <div className="py-1" role="none">
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
              id="menu-item-0"
            >
              Account settings
            </a>
          </div>
          <div className="border-t border-gray-100" role="none" />
          <div className="py-1" role="none">
            <form method="POST" action="#" role="none">
              <button
                type="submit"
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
                id="menu-item-1"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default NavBarDropDown;
