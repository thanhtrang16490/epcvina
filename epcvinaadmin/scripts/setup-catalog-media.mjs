import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRole) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, serviceRole, { auth: { persistSession: false } });
const bucketName = "catalog-media";

const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets();
if (listError) throw listError;

const bucketExists = (existingBuckets ?? []).some((bucket) => bucket.name === bucketName);
if (!bucketExists) {
  const { error: createError } = await supabase.storage.createBucket(bucketName, {
    public: true,
    fileSizeLimit: 20 * 1024 * 1024,
  });
  if (createError) throw createError;
  console.log(`Created bucket ${bucketName}`);
} else {
  const { error: updateError } = await supabase.storage.updateBucket(bucketName, {
    public: true,
    fileSizeLimit: 20 * 1024 * 1024,
  });
  if (updateError) throw updateError;
  console.log(`Updated bucket ${bucketName}`);
}

const policyStatements = [
  `create policy if not exists "catalog-media-public-read" on storage.objects for select using (bucket_id = '${bucketName}');`,
  `create policy if not exists "catalog-media-auth-write" on storage.objects for insert with check (bucket_id = '${bucketName}');`,
  `create policy if not exists "catalog-media-auth-update" on storage.objects for update using (bucket_id = '${bucketName}') with check (bucket_id = '${bucketName}');`,
  `create policy if not exists "catalog-media-auth-delete" on storage.objects for delete using (bucket_id = '${bucketName}');`,
];

console.log("Run these SQL statements in Supabase SQL editor if policies are not yet present:");
console.log(policyStatements.join("\n"));
