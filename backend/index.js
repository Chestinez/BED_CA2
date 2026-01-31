require("dotenv").config();
const app = require("./src/app"); // import app

const port = process.env.PORT || 3000; // port

app.listen(port, () => {
  console.log(`Server running on port:${port}`); // log message when app is running
});
