import { migrateStorage } from './migration';

export const exportChats = () => {
  const raw = localStorage.getItem('chats');
  if (!raw) return;

  const data = JSON.parse(raw);

  const backup = {
    app: 'my-chat-app',
    format: 'chat-backup',
    exportedAt: new Date().toISOString(),
    data,
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: 'application/json',
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'chat-backup.json';

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
};

export const importChats = async (file: File) => {
  const text = await file.text();

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('Invalid JSON file');
  }

  if (
    typeof parsed !== 'object' ||
    parsed.app !== 'my-chat-app' ||
    parsed.format !== 'chat-backup'
  ) {
    throw new Error('Invalid backup file');
  }

  const migrated = migrateStorage(parsed.data);

  localStorage.setItem('chats', JSON.stringify(migrated));

  return migrated;
};
