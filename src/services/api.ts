const BASE_URL = "http://localhost:8080/TaskTrackerBackend_war_exploded/TaskServlet";

export const getTasks = async () => {
  const response = await fetch(BASE_URL);
  return response.json();
};

export const addTask = async (title: string, description: string) => {
  await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `title=${title}&description=${description}`
  });
};

const AUTH_BASE_URL = "http://localhost:8080/TaskTrackerBackend_war_exploded/AuthServlet";

export const registerUser = async (
  username: string,
  email: string,
  password: string
) => {
  console.log("====== registerUser CALLED ======");
  console.log("URL:", AUTH_BASE_URL);
  console.log("Username:", username);
  console.log("Email:", email);
  console.log("Password length:", password.length);

  try {
    console.log("Sending fetch request...");
    
    const response = await fetch(AUTH_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `action=register&username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
    });

    console.log("Response received!");
    console.log("Status:", response.status);
    console.log("Status Text:", response.statusText);
    console.log("OK:", response.ok);
    console.log("Headers:", JSON.stringify([...response.headers.entries()]));

    const text = await response.text();
    console.log("Raw response text:", text);

    let data;
    try {
      data = JSON.parse(text);
      console.log("Parsed JSON:", JSON.stringify(data, null, 2));
    } catch (e) {
      console.error("Failed to parse JSON:", e);
      console.error("Response was:", text);
      return { error: "Invalid response from server" };
    }

    console.log("====== registerUser COMPLETE ======");
    return data;

  } catch (error) {
    console.error("====== registerUser ERROR ======");
    console.error("Error type:", error instanceof Error ? error.name : typeof error);
    console.error("Error message:", error instanceof Error ? error.message : String(error));
    console.error("Full error:", error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  console.log("====== loginUser CALLED ======");
  console.log("URL:", AUTH_BASE_URL);
  console.log("Email:", email);

  try {
    const response = await fetch(AUTH_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `action=login&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
    });

    console.log("Login response status:", response.status);
    console.log("Login response OK:", response.ok);

    const text = await response.text();
    console.log("Login raw response:", text);

    let data;
    try {
      data = JSON.parse(text);
      console.log("Login parsed data:", JSON.stringify(data, null, 2));
    } catch (e) {
      console.error("Failed to parse login response:", e);
      return { error: "Invalid response from server" };
    }

    console.log("====== loginUser COMPLETE ======");
    return data;

  } catch (error) {
    console.error("====== loginUser ERROR ======");
    console.error("Error:", error instanceof Error ? error.message : String(error));
    throw error;
  }
};