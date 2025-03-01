export async function sendPuzzle2Player(
  playerToken: string,
  boothToken: string,
) {
  const body = new FormData();
  body.append("receiver", playerToken);

  return fetch(`/api/player/deliver`, {
    method: "POST",
    body: JSON.stringify({ boothToken, playerToken }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
  //   const response = await fetch(
  //     `${API_URL}/event/puzzle/deliver?token=${boothToken}`,
  //     {
  //       method: "POST",

  //   return fetch(`${API_URL}/event/puzzle/deliver?token=${boothToken}`, {
  //     method: "POST",
  //     body: body,
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (!data.message) return puzzleSuccess;
  //       else if (data.message === puzzleTaken) return puzzleTaken;
  //       else if (data.message === invalidToken) return invalidToken;
  //       else if (data.message === invalidUser) throw new Error(invalidUser);
  //       else throw new Error("Unknown error", data);
  //     });
}
