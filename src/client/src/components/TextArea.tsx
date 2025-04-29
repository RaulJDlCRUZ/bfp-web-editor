/* Adapted from: https://www.material-tailwind.com/docs/html/textarea */
import { JSX } from "react";

function TextArea(): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-start pt-10">
      <div className="resize-none md:resize w-11/12 h-96">
        <textarea
          className="w-full h-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-900"
          rows={4}
          cols={50}
        ></textarea>
      </div>
      <div className="flex justify-end w-11/12 py-1.5">
        <div className="flex gap-2">
          <button
            className="px-4 py-2 text-s font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-md select-none hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
          >
            Cancel
          </button>
          <button
            className="select-none rounded-md bg-gray-900 py-2 px-4 text-center align-middle text-s font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default TextArea;
