export = {
    apiRoot: process.env.API_ROOT,
    mongoDBPath: `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`,
    user: {
        email: process.env.API_EMAIL,
        password: process.env.API_PASSWORD,
    }
}