import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

export const storeImageUri = functions.https.onCall(async (data, context) => {
  // Ensure the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  const dataUri = data.dataUri;
  if (!dataUri) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with a valid dataUri parameter."
    );
  }

  const fileName = `images/${Date.now()}.jpg`;
  const bucket = admin.storage().bucket();
  const file = bucket.file(fileName);

  // Convert data URI to Buffer
  const buffer = Buffer.from(dataUri.split(",")[1], "base64");

  try {
    await file.save(buffer, {
      metadata: {
        contentType: "image/jpeg",
      },
    });

    // Make the file publicly accessible
    await file.makePublic();

    // Construct the public URL
    const url = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

    return url;
  } catch (error) {
    console.error("There was an error uploading the file:", error);
    throw new functions.https.HttpsError("unknown", "Error uploading file");
  }
});
