export const formatDateInput = (text) => {
  const cleaned = text.replace(/[^\d]/g, '');
  const truncated = cleaned.slice(0, 8);

  if (truncated.length > 4) {
    return `${truncated.slice(0, 2)}/${truncated.slice(2, 4)}/${truncated.slice(4)}`;
  } else if (truncated.length > 2) {
    return `${truncated.slice(0, 2)}/${truncated.slice(2)}`;
  } else {
    return truncated;
  }
};