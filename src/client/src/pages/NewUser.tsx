import { JSX } from "react";

import { CreateUserFromForm } from "@/services/userOperations";

function NewUserForm(): JSX.Element {
  async function handleFormData(): Promise<void> {
    try {
      const userData = {
        name: (
          document.querySelector(
            'input[placeholder="Your First Name"]'
          ) as HTMLInputElement
        )?.value,
        lastNames: [
          (
            document.querySelector(
              'input[placeholder="Last Name 1"]'
            ) as HTMLInputElement
          )?.value,
          (
            document.querySelector(
              'input[placeholder="Last Name 2"]'
            ) as HTMLInputElement
          )?.value,
        ],
        email: (
          document.querySelector(
            'input[placeholder="Your educative email"]'
          ) as HTMLInputElement
        )?.value,
        password: (
          document.querySelector(
            'input[placeholder="Your password"]'
          ) as HTMLInputElement
        )?.value,
        technology: (
          document.querySelector(
            'input[placeholder="Your technology (e.g., Information Systems)"]'
          ) as HTMLInputElement
        )?.value,
        phone: (
          document.querySelector(
            'input[placeholder="Spanish phone number"]'
          ) as HTMLInputElement
        )?.value,
      };

      const tfgData = {
        title: (
          document.querySelector(
            'input[placeholder="Your TFG title"]'
          ) as HTMLInputElement
        )?.value,
        subtitle: (
          document.querySelector(
            'input[placeholder="Your TFG subtitle (or TFG name in other languages)"]'
          ) as HTMLInputElement
        )?.value,
        language: (
          document.querySelector("#language-select") as HTMLSelectElement
        )?.value,
        call: {
          year: (
            document.querySelector(
              'input[placeholder="Year"]'
            ) as HTMLInputElement
          )?.value,
          month: (document.querySelector("#month-select") as HTMLSelectElement)
            ?.value,
        },
        tutor: (
          document.querySelector(
            'input[placeholder="Your tutor\'s name"]'
          ) as HTMLInputElement
        )?.value,
        coTutor: (
          document.querySelector(
            'input[placeholder="Your co-tutor\'s name (if you have one)"]'
          ) as HTMLInputElement
        )?.value,
        department: (
          document.querySelector(
            'input[placeholder="Tutor\'s department (e.g., Computer Science Dpt.)"]'
          ) as HTMLInputElement
        )?.value,
      };

      await CreateUserFromForm({ userData, tfgData });
      alert("New user created successfully!");
      // Redirect to the environment
      window.location.href = "/";
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("An error occurred while saving changes. Please try again.");
      return;
    }
  }

  return (
    <div className="bg-gray-100">
      <div className="flex flex-col items-center justify-center w-full">
        <h1 className="text-6xl text-gray-700 font-bold">TFG Web Editor</h1>
        <p className="text-gray-600 text-2xl mt-4">
          A simple web compiler for TFG documents
        </p>
        <p className="text-gray-400 text-lg mt-4">
          Specify your personal data and TFG information to create a new
          document.
        </p>
        <div className="mt-4"></div>
        <div className="flex flex-row space-x-8 w-3/4 justify-center flex-grow">
          {/* User Form */}
          <form className="bg-white p-6 shadow-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">User Data</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Your First Name"
                className="mt-1 block w-full border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Last Names <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="Last Name 1"
                  className="mt-1 block w-1/2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Last Name 2"
                  className="mt-1 block w-1/2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="Your educative email"
                className="mt-1 block w-full border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                placeholder="Your password"
                className="mt-1 block w-full border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Technology <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Your technology (e.g., Information Systems)"
                className="mt-1 block w-full border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="number"
                placeholder="Spanish phone number"
                className="mt-1 block w-1/2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <p className="text-sm text-red-500">* Required fields</p>
          </form>

          {/* TFG Information Form */}
          <form className="bg-white p-6 shadow-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">TFG Information</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Your TFG title"
                className="mt-1 block w-full border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Subtitle
              </label>
              <input
                type="text"
                placeholder="Your TFG subtitle (or TFG name in other languages)"
                className="mt-1 block w-full border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Language <span className="text-red-500">*</span>
              </label>
              <select
                id="language-select"
                className="mt-1 block w-full border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="Spanish">Spanish</option>
                <option value="English">English</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Call (Year and Month) <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-4">
                <input
                  type="number"
                  placeholder="Year"
                  className="mt-1 block w-1/2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <select
                  id="month-select"
                  className="mt-1 block w-full border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  defaultValue="JUNIO"
                >
                  <option value="ENERO">ENERO</option>
                  <option value="FEBRERO">FEBRERO</option>
                  <option value="MARZO">MARZO</option>
                  <option value="ABRIL">ABRIL</option>
                  <option value="MAYO">MAYO</option>
                  <option value="JUNIO">JUNIO</option>
                  <option value="JULIO">JULIO</option>
                  <option value="AGOSTO">AGOSTO</option>
                  <option value="SEPTIEMBRE">SEPTIEMBRE</option>
                  <option value="OCTUBRE">OCTUBRE</option>
                  <option value="NOVIEMBRE">NOVIEMBRE</option>
                  <option value="DICIEMBRE">DICIEMBRE</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Tutor <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Your tutor's name"
                className="mt-1 block w-full border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Co-tutor
              </label>
              <input
                type="text"
                placeholder="Your co-tutor's name (if you have one)"
                className="mt-1 block w-full border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Department <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Tutor's department (e.g., Computer Science Dpt.)"
                className="mt-1 block w-full border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <p className="text-sm text-red-500">* Required fields</p>
          </form>
        </div>
      </div>
      <div className="flex justify-center mt-6">
        <button
          onClick={handleFormData}
          className="select-none rounded-sm bg-gray-900 py-2 px-4 text-center align-middle text-s font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
        >
          Apply Changes
        </button>
      </div>
    </div>
  );
}

export default NewUserForm;
