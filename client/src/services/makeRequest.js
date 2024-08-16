async function makeQuery(url, method, body, loading) {
  loading(true);
  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : null,
    });
    loading(false);
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export default makeQuery;
