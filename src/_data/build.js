const now = new Date();

export default {
  year: now.getFullYear(),
  date: now.toISOString().slice(0, 10),
};
