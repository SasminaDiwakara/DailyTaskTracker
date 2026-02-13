const BASE_URL = "http://192.168.100.97:8081/TaskTrackerBackend/TaskServlet";

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
