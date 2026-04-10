const BASE = "/tasks";

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
};

export const fetchTasks = (status = "all") => {
  const url = status !== "all" ? `${BASE}?status=${status}` : BASE;
  return fetch(url).then(handleResponse);
};

export const createTask = (title) =>
  fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  }).then(handleResponse);

export const updateTask = (id, updates) =>
  fetch(`${BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  }).then(handleResponse);

export const deleteTask = (id) =>
  fetch(`${BASE}/${id}`, { method: "DELETE" }).then(handleResponse);
