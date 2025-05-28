const _apiUrl = "/api/workorder";

export const getIncompleteWorkOrders = () => {
return fetch(_apiUrl + "/incomplete", {
  credentials: "include"
}).then((res) => {
  console.log("Fetch status:", res.status);
  return res.json();
});

};