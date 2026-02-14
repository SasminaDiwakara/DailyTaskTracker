const BASE_URL = "http://localhost:8080/TaskTrackerBackend_war_exploded/TaskServlet";

export const getTasks = async (email: string) => {
  const response = await fetch(`${BASE_URL}?email=${encodeURIComponent(email)}`);
  return response.json();
};

export const addTask = async (title: string, description: string, email: string) => {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&email=${encodeURIComponent(email)}`
  });
  return response.json();
};

const AUTH_BASE_URL = "http://localhost:8080/TaskTrackerBackend_war_exploded/AuthServlet";

export const registerUser = async (
  username: string,
  email: string,
  password: string
) => {

  console.log("Username:", username);
  console.log("Email:", email);
 

  try {
    console.log("Sending fetch request...");
    
    const response = await fetch(AUTH_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `action=register&username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
    });


    const text = await response.text();
    console.log("Raw response text:", text);

    let data;
    try {
      data = JSON.parse(text);
      console.log("Parsed JSON:", JSON.stringify(data, null, 2));
    } catch (e) {
      return { error: "Invalid response from server" };
    }

    return data;

  } catch (error) {
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {

  try {
    const response = await fetch(AUTH_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `action=login&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
    });

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return { error: "Invalid response from server" };
    }
    return data;

  } catch (error) {
    throw error;
  }
};

export const deleteTask = async (taskId: number, email: string) => {
  console.log("🗑️ deleteTask called");
  console.log("Task ID:", taskId);
  console.log("Email:", email);
  
  const response = await fetch(`${BASE_URL}?id=${taskId}&email=${encodeURIComponent(email)}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  
  console.log("Response status:", response.status);
  const data = await response.json();
  console.log("Response:", data);
  
  return data;
};