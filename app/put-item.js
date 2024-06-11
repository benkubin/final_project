import { PutItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});

export const putItem = async () => {
    const command = new PutItemCommand({
        TableName: "snapacat-posts",
       Item: {
            catName: { S: "Chocolate Chip" },
            imageURL: { S: "https://marss-storage.s3.us-west-2.amazonaws.com/IMG_7769.jpeg"  },
           postContent: { S: "Yay cats!" },
           lat: { N: -122.420749 },
           lng: { N: 47.659957 },
        },
    });

    const response = await client.send(command);
    console.log(response);
    return response;
};
