const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);

const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const { uploadFile, getFileStream, deleteObject } = require("./s3");

const app = express();
app.use(bodyParser.json());

app.get("/images/:key", (req, res) => {
  const key = req.params.key;
  const readStream = getFileStream(key);

  readStream.pipe(res);
});

app.post("/images", upload.single("file"), async (req, res) => {
  const file = req.file;
  const result = await uploadFile(file);
  await unlinkFile(file.path);
  const description = req.body.description;
  res.send({ imagePath: `/images/${result.key}` });
});

app.post("/delete", async (req, res) => {
  const { image } = req.body;
  try {
    deleteObject(image).then((data) => {
      console.log(data);
    });
    res.send({ data: data });
  } catch (error) {
    res.send({ data: "error" });
  }
});
app.listen(8080, () => console.log("Listening on port 8080"));
