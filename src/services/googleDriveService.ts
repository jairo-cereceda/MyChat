// src/services/googleDriveService.ts
/// <reference types="google.accounts" />

const CLIENT_ID =
  '619994819133-hn1lkmni8purpb7rk73o7uscd3egb1a3.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

interface DriveFile {
  id: string;
  name: string;
}

interface DriveSearchResponse {
  files: DriveFile[];
}

export const initTokenClient = (
  callback: (token: string) => void
): google.accounts.oauth2.TokenClient => {
  return google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: (response: google.accounts.oauth2.TokenResponse) => {
      if (response.access_token) {
        callback(response.access_token);
      }
    },
  });
};

export const uploadToDrive = async (
  token: string,
  data: unknown
): Promise<Response> => {
  const fileName = 'mi_app_backup.json';

  // 1. Buscar si el archivo ya existe
  const searchRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=name='${fileName}' and trashed=false`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const searchData: DriveSearchResponse = await searchRes.json();
  const fileId = searchData.files.length > 0 ? searchData.files[0].id : null;

  // 2. Configurar URL y Método
  const url = fileId
    ? `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`
    : 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';

  const method = fileId ? 'PATCH' : 'POST';

  const metadata = { name: fileName, mimeType: 'application/json' };
  const formData = new FormData();
  formData.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  );
  formData.append(
    'file',
    new Blob([JSON.stringify(data)], { type: 'application/json' })
  );

  return fetch(url, {
    method,
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
};
