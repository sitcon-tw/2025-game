import { API_URL } from "./const";

export async function getBoothName(token: string) {
  const url = `${API_URL}/event/puzzle/deliverer?token=${token}`;
  return fetch(`${API_URL}/event/puzzle/deliverer?token=${token}`).then(
    (res) => {
      return res.status === 200 ? res.json() : null;
    },
  );
}
