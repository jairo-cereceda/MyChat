export const getLocalTimestamp = () => {
  const now = new Date();

  const offset = now.getTimezoneOffset() * 60000;
  const localIsoTime = new Date(now.getTime() - offset)
    .toISOString()
    .slice(0, -1);
  return localIsoTime;
};
