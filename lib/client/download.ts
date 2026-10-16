/** Triggers a browser download of in-memory data. Nothing is uploaded. */
export function downloadBlob(filename: string, blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  // Revoke on the next tick so Safari has time to start the download.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function downloadText(filename: string, text: string, mimeType = "text/plain"): void {
  downloadBlob(filename, new Blob([text], { type: `${mimeType};charset=utf-8` }));
}
