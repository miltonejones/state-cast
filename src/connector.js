const API_ENDPOINT = 'https://itunes.apple.com/search';
const RSS_ENDPOINT =
  'https://ef9jmtk9rk.execute-api.us-east-1.amazonaws.com/json';

export const getPodcasts = async (term) => {
  const response = await fetch(
    `${API_ENDPOINT}/?term=${term}&media=podcast&limit=200`
  );
  return await response.json();
};

export const getPodcast = async (url) => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }, 0, 2),
  };
  // send GET request
  const response = await fetch(RSS_ENDPOINT, requestOptions);
  try {
    const res = await response.text();

    return res;
  } catch (e) {
    console.log({ 'setApplication error': e });
    return false;
  }
};
