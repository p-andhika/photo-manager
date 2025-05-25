const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const multer = require("multer");
const cors = require("cors");

const app = express();
app.use(cors());
const port = 3003;
const photoDir = "./photos";

// Set up multer for file uploads
const upload = multer({ dest: photoDir });

// Middleware to parse JSON bodies
app.use(express.json());

// Set a random error rate between 20% and 90%
const errorRate = Math.random() * 0.7 + 0.2;
console.log(
  `Server started with an error rate of ${(errorRate * 100).toFixed(2)}%`,
);

// Middleware to simulate random failures
const simulateFailure = (req, res, next) => {
  if (Math.random() < errorRate) {
    console.log("Simulated failure");
    return res.status(503).json({ error: "Simulated failure" });
  }
  next();
};

// Apply the simulateFailure middleware to all routes
// app.use(simulateFailure);

// List all photo IDs
app.get("/photos", async (req, res) => {
  try {
    const files = await fs.readdir(photoDir);
    const photoIds = files
      .filter((file) => !file.endsWith(".json"))
      .map((file) => path.parse(file).name);
    res.json(photoIds);
  } catch (error) {
    res.status(500).json({ error: "Failed to list photos" });
  }
});

// Get photo by ID
app.get("/photos/:id", async (req, res) => {
  const { id } = req.params;
  const photoPath = path.resolve(path.join(photoDir, id));
  try {
    await fs.access(photoPath);
    res.sendFile(photoPath);
  } catch (error) {
    res.status(404).json({ error: "Photo not found" });
  }
});

// Upload a photo
app.post("/photos", upload.single("photo"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Request missing file" });
  }
  const id = req.file.filename;
  const metadata = req.body.metadata || "{}";

  try {
    await fs.writeFile(path.join(photoDir, `${id}.json`), metadata);
    res.status(200).json({ id });
  } catch (error) {
    res.status(500).json({ error: "Failed to save metadata" });
  }
});

// Delete a photo
app.delete("/photos/:id", async (req, res) => {
  const { id } = req.params;
  const photoPath = path.join(photoDir, id);
  const metadataPath = path.join(photoDir, `${id}.json`);
  try {
    await fs.unlink(photoPath);
    await fs.unlink(metadataPath);
    res.status(200).json({ message: "Photo deleted successfully" });
  } catch (error) {
    res.status(404).json({ error: "Photo not found or already deleted" });
  }
});

// Get all metadata
app.get("/metadata", async (req, res) => {
  try {
    const files = (await fs.readdir(photoDir)).filter((fname) =>
      fname.endsWith(".json"),
    );
    const result = [];

    for (const fname of files) {
      const metadataPath = path.join(photoDir, fname);
      const metadata = await fs.readFile(metadataPath, "utf-8");
      result.push({
        id: fname.split(".")[0],
        metadata: JSON.parse(metadata),
      });
    }

    res.json(result);
  } catch (error) {
    res.status(404).json({ error: "No metadata files found" });
  }
});

// Get metadata for photo id
app.get("/metadata/:id", async (req, res) => {
  const { id } = req.params;
  const metadataPath = path.join(photoDir, `${id}.json`);

  try {
    const metadata = await fs.readFile(metadataPath, "utf-8");
    res.json(JSON.parse(metadata));
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "Metadata not found" });
  }
});

// Update metadata
app.put("/metadata/:id", async (req, res) => {
  const { id } = req.params;
  const metadata = req.body?.metadata || "{}";

  try {
    await fs.writeFile(
      path.join(photoDir, `${id}.json`),
      JSON.stringify(metadata),
    );
    res.status(200).json({ id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to save metadata" });
  }
});

// catch all
app.all(/(.*)/, (req, res) => {
  console.log("Not found ", req.url);
  res.status(404).json({ error: `${req.method} ${req.url} not found` });
});

// Start server
app.listen(port, () => {
  console.log(`Photo API listening at http://localhost:${port}`);
});
