import { expect, test } from "@playwright/test";

test("rejects cross-origin state-changing requests", async ({ request }) => {
  const endpoints = [
    "/api/follow",
    "/api/notes",
    "/api/reaction",
    "/api/renote",
  ];

  for (const endpoint of endpoints) {
    const response = await request.post(endpoint, {
      headers: {
        Origin: "https://attacker.example",
        "Sec-Fetch-Site": "cross-site",
      },
    });

    expect(response.status(), endpoint).toBe(403);
  }
});

test("allows same-origin state-changing requests", async ({ request }) => {
  const endpoints = [
    "/api/follow",
    "/api/notes",
    "/api/reaction",
    "/api/renote",
  ];

  for (const endpoint of endpoints) {
    const response = await request.post(endpoint, {
      headers: {
        Origin: "http://localhost:5173",
        "Sec-Fetch-Site": "same-origin",
      },
    });

    expect(response.status(), endpoint).not.toBe(403);
  }
});
