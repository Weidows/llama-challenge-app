const baseURL = "http://localhost:5000";

// 定义接口结构
interface ApiKeyResponse {
  "bot.api_key": string;
}

interface UpdateApiKeyResponse {
  "bot.api_key": string;
  status: string;
}

interface SessionListResponse {
  sessions: string[];
}

interface ListResponse {
  data: string[];
}

interface UpdateSessionResponse {
  "runtime.current_session_id": string;
  status: string;
}

interface SessionDataResponse {
  id: string;
  message_list: {
    content: string;
    id: string;
    role: string;
    time_created: string;
  }[];
  time_created: string;
  vector_store_id: string | null;
}

interface NewSessionResponse {
  session_id: string;
}

interface AskResponse {
  content: string;
  agent_name: string;
  data: {
    action: string;
    message: string;
    title: string;
  };
}

export const fetchApiKey = async (): Promise<string> => {
  const response = await fetch(baseURL + "/config/bot.api_key");
  const data = (await response.json()) as ApiKeyResponse;
  return data["bot.api_key"];
};

export const updateApiKey = async (
  newKey: string,
): Promise<UpdateApiKeyResponse> => {
  const response = await fetch(baseURL + "/config/bot.api_key", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ value: newKey }),
  });
  const data = (await response.json()) as UpdateApiKeyResponse;
  return data;
};

export const fetchSessionList = async (): Promise<string[]> => {
  const response = await fetch(baseURL + "/history", {
    method: "GET",
  });

  const data = (await response.json()) as SessionListResponse;
  return data.sessions;
};

export const updateCurrentSession = async (
  sessionId: string,
): Promise<UpdateSessionResponse> => {
  const response = await fetch(baseURL + "/config/runtime.current_session_id", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ value: sessionId }),
  });
  const data = (await response.json()) as UpdateSessionResponse;
  return data;
};

export const fetchSessionData = async (): Promise<SessionDataResponse> => {
  const response = await fetch(baseURL + "/session");
  const data = (await response.json()) as SessionDataResponse;
  return data;
};

export const deleteSession = async (sessionId: string): Promise<void> => {
  await fetch(baseURL + "/history", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ session_id: sessionId }),
  });
};

export const createNewSession = async (): Promise<NewSessionResponse> => {
  const response = await fetch(baseURL + "/history", {
    method: "PUT",
  });
  const data = (await response.json()) as NewSessionResponse;
  return data;
};

export const fetchBotList = async (): Promise<string[]> => {
  const response = await fetch(baseURL + "/bots");
  const respData = (await response.json()) as ListResponse;
  return respData.data;
};

export const fetchAgentList = async (): Promise<string[]> => {
  const response = await fetch(baseURL + "/agent");
  const respData = (await response.json()) as ListResponse;
  return respData.data;
};

// 新增的 askQuestion 函数
export const askQuestion = async (
  content: string,
  agent: string,
  data: {},
): Promise<AskResponse> => {
  const response = await fetch(baseURL + "/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content, agent, data }),
  });
  const resp = (await response.json()) as AskResponse;
  return resp;
};
