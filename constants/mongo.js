exports.URL = `mongodb+srv://${
    process.env.MONGODB_USER
}:${
    process.env.MONGODB_PASSWORD
}@${
    process.env.MONGODB_URL
}/${
    process.env.ENV
}?retryWrites=true&w=majority`;

exports.OPTIONS = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
};