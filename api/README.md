# 🚫 DO NOT MODIFY THE API PART
---
```sh
npm install
npm run start
```

---
# Photo API Endpoints

## Base URL

```
http://localhost:3003
```

---

## List All Photo IDs

**GET** `/photos`

- **Description:** Returns an array of all photo IDs.
- **Response:**
  `200 OK`
  ```json
  ["photoId1", "photoId2", ...]
  ```

---

## Get Photo by ID

**GET** `/photos/:id`

- **Description:** Returns the photo file for the given ID.
- **Response:**
  `200 OK` — Photo file
  `404 Not Found`
  ```json
  { "error": "Photo not found" }
  ```

---

## Upload a Photo

**POST** `/photos`

- **Description:** Uploads a photo file and metadata.
- **Request:**
  - `multipart/form-data`
    - `photo`: file (required)
    - `metadata {updatedAt, tags}`: JSON string (required)
- **Response:**
  `200 OK`
  ```json
  { "id": "photoId" }
  ```
  `400 Bad Request`
  ```json
  { "error": "Request missing file" }
  ```

---

## Delete a Photo

**DELETE** `/photos/:id`

- **Description:** Deletes the photo and its metadata for the given ID.
- **Response:**
  `200 OK`
  ```json
  { "message": "Photo deleted successfully" }
  ```
  `404 Not Found`
  ```json
  { "error": "Photo not found or already deleted" }
  ```

---

## Get All Metadata

**GET** `/metadata`

- **Description:** Returns an array of all photo metadata.
- **Response:**
  `200 OK`
  ```json
  [
    { "id": "photoId1", "metadata": { "updatedAt": "2023-11-15T10:23:45.000Z", "tags": ["tag1, tag2"] } },
    { "id": "photoId2", "metadata": { "updatedAt": "2024-02-28T17:05:12.000Z", "tags": ["tag1, tag2"] } }
  ]
  ```
  `404 Not Found`
  ```json
  { "error": "No metadata files found" }
  ```

---

## Get Metadata for Photo ID

**GET** `/metadata/:id`

- **Description:** Returns metadata for the specified photo ID.
- **Response:**
  `200 OK`
  ```json
  { "updatedAt": "2023-11-15T10:23:45.000Z", "tags": ["tag1, tag2"] }
  ```
  `404 Not Found`
  ```json
  { "error": "Metadata not found" }
  ```

---

## Update Metadata

**PUT** `/metadata/:id`

- **Description:** Updates metadata for the specified photo ID.
- **Request:**
  - `application/json`
    ```json
    { "metadata": { "updatedAt": "2023-11-15T10:23:45.000Z", "tags": ["tag1, tag2"] } }
    ```
- **Response:**
  `200 OK`
  ```json
  { "id": "photoId" }
  ```
  `500 Internal Server Error`
  ```json
  { "error": "Failed to save metadata" }
  ```

---

## Catch-All (Not Found)

**ALL** `*`

- **Description:** Returns a 404 error for any undefined route.
- **Response:**
  `404 Not Found`
  ```json
  { "error": "METHOD /path not found" }
  ```