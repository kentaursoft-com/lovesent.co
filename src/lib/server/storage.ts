// ===== Storage Module for Backblaze B2 (Native API) =====
// Uses B2 native REST API — guaranteed to work in Cloudflare Workers
// No external SDK dependencies required

interface StorageEnv {
	BACKBLAZE_KEY_ID?: string;
	BACKBLAZE_APP_KEY?: string;
	BACKBLAZE_BUCKET_NAME?: string;
}

// Allowed image types and max size (5MB)
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024;

export function validateImage(file: File): { valid: boolean; error?: string } {
	if (!ALLOWED_TYPES.includes(file.type)) {
		return { valid: false, error: 'Only JPEG, PNG, GIF, and WebP images are allowed 📸' };
	}
	if (file.size > MAX_SIZE) {
		return { valid: false, error: 'Image must be smaller than 5MB 💕' };
	}
	return { valid: true };
}

// Step 1: Authorize with B2
async function b2Authorize(keyId: string, appKey: string): Promise<{
	authorizationToken: string;
	apiUrl: string;
	downloadUrl: string;
	accountId?: string;
	allowed: { bucketId?: string; bucketName?: string };
}> {
	const resp = await fetch('https://api.backblazeb2.com/b2api/v2/b2_authorize_account', {
		method: 'GET',
		headers: {
			Authorization: `Basic ${btoa(`${keyId}:${appKey}`)}`
		}
	});

	if (!resp.ok) {
		const err = await resp.text();
		throw new Error(`B2 auth failed: ${resp.status} ${err}`);
	}

	return resp.json();
}

// Step 2: List buckets to find bucket ID by name
async function b2ListBuckets(
	apiUrl: string,
	authToken: string,
	accountId: string,
	bucketName: string
): Promise<string> {
	const resp = await fetch(`${apiUrl}/b2api/v2/b2_list_buckets`, {
		method: 'POST',
		headers: {
			Authorization: authToken,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ accountId, bucketName })
	});

	if (!resp.ok) {
		const err = await resp.text();
		throw new Error(`B2 list buckets failed: ${resp.status} ${err}`);
	}

	const data: { buckets: Array<{ bucketId: string; bucketName: string }> } = await resp.json();
	const bucket = data.buckets.find((b) => b.bucketName === bucketName);
	
	if (!bucket) {
		throw new Error(
			`B2 bucket '${bucketName}' not found. Available buckets: ${data.buckets.map(b => b.bucketName).join(', ')}`
		);
	}
	
	return bucket.bucketId;
}
4
// Step 3: Get upload URL for a bucket
async function b2GetUploadUrl(
	apiUrl: string,
	authToken: string,
	bucketId: string
): Promise<{ uploadUrl: string; authorizationToken: string }> {
	const resp = await fetch(`${apiUrl}/b2api/v2/b2_get_upload_url`, {
		method: 'POST',
		headers: {
			Authorization: authToken,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ bucketId })
	});

	if (!resp.ok) {
		const err = await resp.text();
		throw new Error(`B2 get upload URL failed: ${resp.status} ${err}`);
	}

	return resp.json();
}

// Step 3: Upload file to B2
async function b2UploadFile(
	uploadUrl: string,
	authToken: string,
	fileName: string,
	data: ArrayBuffer,
	contentType: string
): Promise<{ fileName: string; fileId: string }> {
	// Compute SHA-1 hash of the file
	const sha1Buffer = await crypto.subtle.digest('SHA-1', data);
	const sha1Hex = Array.from(new Uint8Array(sha1Buffer))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');

	const resp = await fetch(uploadUrl, {
		method: 'POST',
		headers: {
			Authorization: authToken,
			'X-Bz-File-Name': encodeURIComponent(fileName),
			'Content-Type': contentType,
			'Content-Length': String(data.byteLength),
			'X-Bz-Content-Sha1': sha1Hex
		},
		body: data
	});

	if (!resp.ok) {
		const err = await resp.text();
		throw new Error(`B2 upload failed: ${resp.status} ${err}`);
	}

	return resp.json();
}

// Upload to Backblaze B2 via native API
export async function uploadToBackblaze(
	env: StorageEnv,
	key: string,
	data: ArrayBuffer,
	contentType: string
): Promise<string> {
	const keyId = env.BACKBLAZE_KEY_ID || '';
	const appKey = env.BACKBLAZE_APP_KEY || '';
	const bucketName = env.BACKBLAZE_BUCKET_NAME || 'lovesent-photos';

	if (!keyId || !appKey) {
		throw new Error('Backblaze B2 credentials not configured');
	}

	// Authorize
	const auth = await b2Authorize(keyId, appKey);

	// Get bucketId — use the one from auth if key is bucket-scoped, otherwise look it up
	let bucketId = auth.allowed?.bucketId;
	if (!bucketId) {
		// Key is not bucket-scoped, so we need to list buckets and find ours by name
		if (!auth.accountId) {
			throw new Error('B2 auth response missing accountId');
		}
		bucketId = await b2ListBuckets(auth.apiUrl, auth.authorizationToken, auth.accountId, bucketName);
	}

	// Get upload URL
	const uploadInfo = await b2GetUploadUrl(auth.apiUrl, auth.authorizationToken, bucketId);

	// Upload
	await b2UploadFile(uploadInfo.uploadUrl, uploadInfo.authorizationToken, key, data, contentType);

	// Return the friendly download URL
	return `${auth.downloadUrl}/file/${bucketName}/${key}`;
}

// Upload a photo for a confession page
export async function uploadPhoto(
	env: StorageEnv,
	file: File,
	slug: string
): Promise<{ url: string; error?: string }> {
	// Validate the image
	const validation = validateImage(file);
	if (!validation.valid) {
		return { url: '', error: validation.error };
	}

	const extension = file.name.split('.').pop() || 'jpg';
	const key = `confessions/${slug}/photo.${extension}`;
	const data = await file.arrayBuffer();

	try {
		const url = await uploadToBackblaze(env, key, data, file.type);
		return { url };
	} catch (err) {
		console.error('Upload error:', err);
		return { url: '', error: 'Failed to upload photo. Please try again! 😢' };
	}
}
