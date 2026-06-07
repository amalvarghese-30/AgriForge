import api from '@/lib/api';

export async function uploadProductImage(file: File): Promise<string> {
  const form = new FormData();
  form.append('file', file);
  const { data } = await api.post('/admin/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data.url;
}
