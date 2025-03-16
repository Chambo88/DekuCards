import useUserStore from "../stores/useUserStore"

const authFetch = async (url : string, options: RequestInit = {}): Promise<Response> => {
  const token = useUserStore.getState().token;
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // handle token expiration or 401 - unauthorized errors here
  if (response.status === 401) {
    // TODO log user out, but safely preserving their changes to tree
    console.warn("User unauthorized.");
  }

  return response;
};

export default authFetch;
