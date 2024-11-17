test("GET to api/v1/status should return 200", async () => {
  const responde = await fetch("http://localhost:3000/api/v1/status");
  expect(responde.status).toBe(200);
});
