const mongoose = require("mongoose");

// mongoose.connect("mongodb://localhost/chat", {
mongoose.connect("mongodb+srv://:@chat-dwrlc.mongodb.net/test?retryWrites=true&w=majority", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
})
    .then(db => console.log("DB connected"))
    .catch(err => console.error(err));