export async function sendMessage(
    message: string
  ) {
    const response = await fetch(
      "/api/chat",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          message,
        }),
      }
    );
  
    return response.json();
  }