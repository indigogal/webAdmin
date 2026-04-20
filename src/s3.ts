import { S3Client, CreateBucketCommand, ListBucketsCommand } from "@aws-sdk/client-s3";


export async function CreateBucket(client: S3Client) {
  const BUCKET_NAME = `default-bucket-${Date.now()}`;
  try {
    const bucketConfig = {
      Bucket: BUCKET_NAME,
    };
    const createCommand = new CreateBucketCommand(bucketConfig);
    const cmdOutput = await client.send(createCommand);
    console.log(`Bucket "${BUCKET_NAME}" creado exitosamente.`);

    return cmdOutput

  } catch (err) {
    console.error(err);
    return err
  }
}

export async function ListBuckets(client: S3Client) {
  const listCommand = new ListBucketsCommand({});
  const buckets = await client.send(listCommand);
  if (!buckets.Buckets) {
    // Added this so the LSP would shut up about unassigned types
    throw new Error("no buckets in buckets.Buckets!")
  }

  buckets.Buckets.forEach(b => {
    console.log(b.Name, " ", b.BucketArn)
  });

  return buckets.Buckets
}
