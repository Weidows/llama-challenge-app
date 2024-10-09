"use client";

import { useEffect, useState } from "react";

import {
  askQuestion,
  createNewSession,
  deleteSession,
  fetchAgentList,
  fetchApiKey,
  fetchBotList,
  fetchSessionData,
  fetchSessionList,
  updateApiKey,
  updateCurrentSession,
} from "./apiService";

// 定义 session 数据的类型
interface Message {
  content: string;
  id: string;
  role: string;
  time_created: string;
}

interface SessionData {
  id: string;
  message_list: Message[];
  time_created: string;
  vector_store_id: string | null;
}

export default function ClientComponent() {
  const [activeSection, setActiveSection] = useState("config");
  const [formData, setFormData] = useState({
    model: "",
    agent: "",
    apiKey: "",
    content: "",
    debugTag: "ALERT",
  });
  const [sessions, setSessions] = useState<string[]>([]);
  const [selectedSession, setSelectedSession] = useState<string>("");
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [modelList, setModelList] = useState<string[]>([]);
  const [agentList, setAgentList] = useState<string[]>([]);

  useEffect(() => {
    const getApiKey = async () => {
      try {
        const apiKey = await fetchApiKey();
        setFormData((prevData) => ({
          ...prevData,
          apiKey: apiKey,
        }));
      } catch (error) {
        console.error("Error fetching API key:", error);
      }
    };
    getApiKey();
  }, []);

  useEffect(() => {
    const getSessionList = async () => {
      try {
        const sessionList = await fetchSessionList();
        setSessions(sessionList);
        if (sessionList.length > 0) {
          setSelectedSession(sessionList[0] ?? "");
        }
      } catch (error) {
        console.error("Error fetching session list:", error);
      }
    };
    getSessionList();
  }, []);

  useEffect(() => {
    const getModelList = async () => {
      try {
        const models = await fetchBotList();
        setModelList(models);
        if (models.length > 0) {
          setFormData((prevData) => ({
            ...prevData,
            model: models[0] ?? "",
          }));
        }
      } catch (error) {
        console.error("Error fetching model list:", error);
      }
    };

    const getAgentList = async () => {
      try {
        const agents = await fetchAgentList();
        setAgentList(agents);
        if (agents.length > 0) {
          setFormData((prevData) => ({
            ...prevData,
            agent: agents[0] ?? "",
          }));
        }
      } catch (error) {
        console.error("Error fetching agent list:", error);
      }
    };

    getModelList();
    getAgentList();
  }, []);

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

  const handleApiKeyUpdate = async () => {
    try {
      const updatedData = await updateApiKey(formData.apiKey);
      console.log("Updated API Key:", updatedData);
    } catch (error) {
      console.error("Error updating API key:", error);
    }
  };

  const handleSessionChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newSessionId = e.target.value;
    setSelectedSession(newSessionId);
    try {
      await updateCurrentSession(newSessionId);
      const data = await fetchSessionData();
      setSessionData(data);
    } catch (error) {
      console.error("Error changing session:", error);
    }
  };

  const handleCreateNewSession = async () => {
    try {
      const newSession = await createNewSession();
      setSessions((prevSessions) => [...prevSessions, newSession.session_id]);
      setSelectedSession(newSession.session_id);
      console.log("New Session Created:", newSession);
    } catch (error) {
      console.error("Error creating new session:", error);
    }
  };

  const handleDeleteSession = async () => {
    if (selectedSession) {
      try {
        await deleteSession(selectedSession);
        setSessions((prevSessions) =>
          prevSessions.filter((session) => session !== selectedSession),
        );
        setSelectedSession(sessions[0] ?? "");
        console.log("Session Deleted:", selectedSession);
      } catch (error) {
        console.error("Error deleting session:", error);
      }
    }
  };

  const handleAsk = async () => {
    try {
      const response = await askQuestion(formData.content, formData.agent, {});
      console.log("Ask Response:", response);
      // 更新 sessionData
      if (sessionData) {
        const data = await fetchSessionData();
        setSessionData(data);
      }
      // Scroll chat box to the bottom
      const chatBox = document.getElementById("chat-box");
      if (chatBox) {
        chatBox.scrollTop = chatBox.scrollHeight;
      }
    } catch (error) {
      console.error("Error asking question:", error);
    }
  };

  return (
    <div className="flex h-screen w-full">
      <nav className="h-full w-1/4 border-2 border-green-700 p-4">
        <ul className="space-y-2">
          <li>
            <a
              className="block p-2 hover:bg-gray-500"
              onClick={() => {
                setActiveSection("config");
              }}
            >
              Config
            </a>
          </li>
          <li>
            <a
              className="block p-2 hover:bg-gray-500"
              onClick={() => setActiveSection("session")}
            >
              Session
            </a>
          </li>
        </ul>
      </nav>
      <div className="max-h-screen w-3/4 p-4">
        {activeSection === "config" && (
          <>
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
                    {modelList.map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label
                    className="mb-2 block text-sm font-bold text-gray-700"
                    htmlFor="agent"
                  >
                    Agent
                  </label>
                  <select
                    id="agent"
                    name="agent"
                    className="w-full border p-2"
                    value={formData.agent}
                    onChange={handleInputChange}
                  >
                    {agentList.map((agent) => (
                      <option key={agent} value={agent}>
                        {agent}
                      </option>
                    ))}
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
                  <h2 className="text-xl font-bold">Debug Window</h2>
                  <input
                    type="text"
                    className="w-full border p-2"
                    placeholder="Enter tag to trigger alert"
                    name="debugTag"
                    value={formData.debugTag}
                    onChange={handleInputChange}
                  />
                </div>

                <button
                  type="submit"
                  className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                >
                  Update
                </button>
              </form>
            </div>
          </>
        )}
        {activeSection === "session" && (
          <section id="session" className="mt-8">
            <h1 className="text-2xl font-bold">Session Management</h1>
            <div className="mb-4">
              <label
                className="mb-2 block text-sm font-bold text-gray-700"
                htmlFor="session"
              >
                Select Session
              </label>
              <select
                id="session"
                name="session"
                className="w-full border p-2"
                value={selectedSession}
                onChange={handleSessionChange}
              >
                {sessions.map((session) => (
                  <option key={session} value={session}>
                    {session}
                  </option>
                ))}
              </select>
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
                className="h-32 w-full border p-2"
                placeholder="Some content to ask"
                value={formData.content}
                onChange={handleInputChange}
              />
            </div>
            <button
              onClick={handleAsk}
              className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
            >
              Ask
            </button>
            <button
              onClick={handleCreateNewSession}
              className="ml-2 rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
            >
              Create New Session
            </button>
            <button
              onClick={handleDeleteSession}
              className="ml-2 rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
            >
              Delete Session
            </button>
            {sessionData && (
              <div className="mt-4">
                <h2 className="text-xl font-bold">Session Data</h2>
                <div
                  id="chat-box"
                  className="h-[500px] space-y-4 overflow-y-scroll p-10"
                >
                  {sessionData.message_list.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xl rounded-lg p-3 ${
                          message.role === "user"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-300 text-black"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
