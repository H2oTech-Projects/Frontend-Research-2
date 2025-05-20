export function createFormData(data: Record<string, any>, fileArrayKey: string): FormData {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (key === fileArrayKey && Array.isArray(value)) {
      value?.forEach((file: File) => {
        formData.append(`${fileArrayKey}`, file);
      });
    } else {
      formData.append(key, value);
    }
  });

  return formData;
}