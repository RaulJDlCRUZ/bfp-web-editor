/* Adapted from Anonymous: https://www.creative-tim.com/twcomponents/component/navbar-7 */
import React from "react";
import TWESVG from "../assets/twe/TWE_black.svg";

const NavBar: React.FC = () => {
  return (
    <nav className="bg-gray-200 shadow shadow-gray-300 w-100 px-8 md:px-auto">
      <div className="md:h-16 h-28 mx-auto md:px-4 container flex items-center justify-between flex-wrap md:flex-nowrap">
        <div className="text-green-500 md:order-1 md:mr-4">
          <img src={TWESVG} alt="TWE Logo" className="h-16 w-16" />
        </div>
        <div className="text-gray-700 text-xl font-bold md:order-2 md:mr-auto">
          TFG Web Editor
        </div>
        <div className="text-gray-500 order-3 w-full md:w-auto md:order-2">
          <ul className="flex font-semibold justify-between">
            <li className="md:px-4 md:py-2 hover:text-green-500">
              <a href="https://www.felixalbertos.com/resources/downloads/tfg_template.html">
                About
              </a>
            </li>
            <li className="md:px-4 md:py-2 hover:text-green-500">
              <a href="https://github.com/RaulJDlCRUZ/">Contact</a>
            </li>
          </ul>
        </div>
        {/* Insert another kind of button here, like Sign In... */}
      </div>
    </nav>
  );
};

export default NavBar;
