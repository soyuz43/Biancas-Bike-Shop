const _apiUrl = "/api/workorder";

export const getIncompleteWorkOrders = () => {
  return fetch(_apiUrl + "/incomplete", {
    credentials: "include",
  }).then((res) => {
    console.log("Fetch status:", res.status);
    return res.json();
  });
};

export const createWorkOrder = (workOrder) => {
  return fetch(_apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(workOrder),
  }).then((res) => res.json()); 
};

export const updateWorkOrder = (workOrder) => {
  return fetch(`${_apiUrl}/${workOrder.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(workOrder),
  });
};

export const completeWorkOrder = (id) =>
  fetch(`${_apiUrl}/${id}/complete`, { method: "PUT" });

export const deleteWorkOrder = (id) =>
  fetch(`${_apiUrl}/${id}`, { method: "DELETE" });
