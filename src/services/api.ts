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
