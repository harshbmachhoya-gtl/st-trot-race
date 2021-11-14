const { MONGO_HOST, MONGO_PORT, MONGO_DATABASE } = process.env;

// MongoDB URL
const mongoDBPath = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`;
export default {mongoDBPath};
