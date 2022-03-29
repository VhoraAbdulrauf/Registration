const mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost:27017/youtubeRegistration', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("It's Connected...");
  })
  .catch((error) => console.log('Not Connected !!!', error));
