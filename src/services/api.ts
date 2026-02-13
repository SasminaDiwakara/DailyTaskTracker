const BASE_URL = "http://192.168.1.5:8080/DailyTaskBackend/TaskServlet";

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
