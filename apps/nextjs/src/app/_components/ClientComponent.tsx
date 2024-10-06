"use client";

import { useState } from "react";

import { CreatePostForm } from "./posts";

export default function ClientComponent() {
  const [activeSection, setActiveSection] = useState("home");
  const [formData, setFormData] = useState({
    model: "llama3.2",
    apiKey: "",
    content: "",
    debugTag: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 处理表单提交逻辑
    console.log("Form Data:", formData);
  };

  return (
    <div className="flex h-screen w-full">
      <nav className="h-full w-1/4 border-2 border-green-700 p-4">
        <ul className="space-y-2">
          <li>
            <a
              className="block p-2 hover:bg-gray-500"
              onClick={() => {
                setActiveSection("home");
              }}
            >
              Home
            </a>
          </li>
          <li>
            <a
              className="block p-2 hover:bg-gray-500"
              onClick={() => setActiveSection("create-post")}
            >
              Create Post
            </a>
          </li>
        </ul>
      </nav>
      <div className="w-3/4 p-4">
        {activeSection === "home" && (
          <>
            <section id="home">
              <h1 className="text-2xl font-bold">Home</h1>
              <p>Welcome to the homepage!</p>
            </section>
            <div className="mt-8">
              <h2 className="text-xl font-bold">Input Interface</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    className="mb-2 block text-sm font-bold text-gray-700"
                    htmlFor="model"
                  >
                    Model
                  </label>
                  <select
                    id="model"
                    name="model"
                    className="w-full border p-2"
                    value={formData.model}
                    onChange={handleInputChange}
                  >
                    <option value="llama3.2">llama3.2</option>
                    <option value="llama3.1">llama3.1</option>
                    <option value="gpt-4o-mini">gpt-4o-mini</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label
                    className="mb-2 block text-sm font-bold text-gray-700"
                    htmlFor="apiKey"
                  >
                    API Key
                  </label>
                  <input
                    type="text"
                    id="apiKey"
                    name="apiKey"
                    className="w-full border p-2"
                    placeholder="Enter your API key"
                    value={formData.apiKey}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="mb-2 block text-sm font-bold text-gray-700"
                    htmlFor="content"
                  >
                    Ask Content
                  </label>
                  <input
                    type="text"
                    id="content"
                    name="content"
                    className="w-full border p-2"
                    placeholder="Some content to ask"
                    value={formData.content}
                    onChange={handleInputChange}
                  />
                </div>
                <button
                  type="submit"
                  className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                >
                  Submit
                </button>
              </form>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold">Debug Window</h2>
              <input
                type="text"
                className="border p-2"
                placeholder="Enter tag to trigger alert"
                name="debugTag"
                value={formData.debugTag}
                onChange={handleInputChange}
              />
            </div>
          </>
        )}
        {activeSection === "create-post" && (
          <section id="create-post" className="mt-8">
            <h1 className="text-2xl font-bold">TODO: delete, just for test</h1>
            <h1 className="text-2xl font-bold">Create Post</h1>
            <CreatePostForm />
          </section>
        )}
      </div>
    </div>
  );
}
