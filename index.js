const { GoogleAuth } = require("google-auth-library");

exports.backupDatastore = async (req, res) => {
  try {
    const BUCKET_NAME = "gs://backup-datastore-bucket";

    const auth = new GoogleAuth({
      scopes: "https://www.googleapis.com/auth/cloud-platform",
    });
    const client = await auth.getClient();
    const projectId = await auth.getProjectId();

    console.log(`Project ID: ${projectId}`);

    const response = await client.request({
      method: "POST",
      url: `https://datastore.googleapis.com/v1/projects/${projectId}:export`,
      data: {
        outputUrlPrefix: BUCKET_NAME,
      },
    });

    console.log("Datastore export started:", response.data);
    res.status(200).json({
      message: "Datastore export started successfully",
      response: response.data,
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "Failed to export Datastore", details: error.message });
  }
};
