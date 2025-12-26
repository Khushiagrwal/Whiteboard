const AWS = require("aws-sdk");

// 🔴 FORCE region + DocumentClient
const dynamo = new AWS.DynamoDB.DocumentClient({
  region: "ap-south-1",
});

exports.handler = async (event) => {
  try {
    console.log("RAW EVENT BODY:", event.body);

    const body = JSON.parse(event.body || "{}");
    console.log("PARSED BODY:", body);

    if (!body.boardId) {
      throw new Error("boardId missing in request");
    }

    const params = {
      TableName: "Whiteboards",
      Item: {
        boardId: String(body.boardId),   // ✅ EXACT key
        canvasData: body.canvasData || "",
        createdAt: new Date().toISOString(),
      },
    };

    console.log("DYNAMO PARAMS:", params);

    await dynamo.put(params).promise();  // ✅ DocumentClient call

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Board saved successfully",
        boardId: body.boardId,
      }),
    };

  } catch (err) {
    console.error("LAMBDA ERROR:", err);

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: "Internal Server Error",
        details: err.message,
      }),
    };
  }
};
