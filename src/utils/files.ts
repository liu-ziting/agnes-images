export function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }

      reject(new Error('Failed to read local image'));
    };

    reader.onerror = () => {
      reject(new Error('Failed to read local image'));
    };

    reader.readAsDataURL(file);
  });
}
