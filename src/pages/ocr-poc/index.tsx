import { useEffect, useRef, useState } from "react";
import { Group, Stack, Text, Image, Progress, Button } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";

import {
  RekognitionClient,
  DetectTextCommand,
} from "@aws-sdk/client-rekognition";

import AWS from "aws-sdk";

const Home = () => {
  const [imageData, setImageData] = useState<{ Bytes: Uint8Array }>();
  const [imageUrl, setImageUrl] = useState<string>();
  const [ocrResult, setOcrResult] = useState<string | undefined>("");

  const readAsArrayBuffer = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const loadFile = (file: File) => {
    setImageUrl(URL.createObjectURL(file));
    readAsArrayBuffer(file).then((result) => {
      setImageData({
        Bytes: new Uint8Array(result as ArrayBuffer),
      });
    });
  };

  const config = new AWS.Config({
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  });

  const client = new RekognitionClient({
    region: "us-east-1",
    credentials: config.credentials as any,
  });

  const params = {
    Image: imageData,
  };

  const extract = async () => {
    const command = new DetectTextCommand(params);

    try {
      const data = await client.send(command);

      setOcrResult(data.TextDetections?.map((d) => d.DetectedText).join(" "));
      // process data.
    } catch (error) {
      // error handling.
    } finally {
      // finally.
    }
  };

  return (
    <>
      <Group align="initial" style={{ padding: "10px" }}>
        <Stack style={{ flex: "1" }}>
          <Dropzone
            onDrop={(files) => loadFile(files[0])}
            accept={IMAGE_MIME_TYPE}
            multiple={false}
          >
            <Text size="xl" inline>
              Drag image here or click to select file
            </Text>
          </Dropzone>

          {!!imageData && (
            <Image src={imageUrl} style={{ width: "100%" }} alt="dropzone" />
          )}
        </Stack>

        <Stack style={{ flex: "1" }}>
          <Button
            style={{
              background: "blue",
            }}
            onClick={extract}
          >
            Extract
          </Button>

          {!!ocrResult && (
            <Stack>
              <Text size="xl">RESULT</Text>
              <Text
                style={{
                  fontFamily: "monospace",
                  padding: "10px",
                }}
              >
                {ocrResult}
              </Text>
            </Stack>
          )}
        </Stack>
      </Group>
    </>
  );
};

export default Home;
