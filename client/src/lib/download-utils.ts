/**
 * Modern file download utility with Save As dialog support
 * Uses File System Access API where available, falls back to traditional download
 */

export interface DownloadOptions {
  filename: string;
  content: string | Blob;
  mimeType?: string;
  description?: string;
}

/**
 * Download a file with Save As dialog (modern browsers) or traditional download (fallback)
 */
export async function downloadWithSaveAs(options: DownloadOptions): Promise<boolean> {
  const { filename, content, mimeType = 'application/octet-stream', description = 'Files' } = options;
  
  // Convert content to blob if it's a string
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  
  // Try modern File System Access API first (Chrome, Edge)
  if ('showSaveFilePicker' in window && window.self === window.top) {
    try {
      // Determine file type and extension for save picker
      const extension = filename.split('.').pop()?.toLowerCase() || '';
      const accepts: Record<string, string[]> = {};
      
      // Set up file type filters based on extension
      switch (extension) {
        case 'json':
          accepts['application/json'] = ['.json'];
          break;
        case 'zip':
          accepts['application/zip'] = ['.zip'];
          break;
        case 'yaml':
        case 'yml':
          accepts['text/yaml'] = ['.yaml', '.yml'];
          break;
        case 'env':
          accepts['text/plain'] = ['.env'];
          break;
        case 'sh':
          accepts['text/plain'] = ['.sh'];
          break;
        case 'md':
          accepts['text/markdown'] = ['.md'];
          break;
        default:
          accepts[mimeType] = [`.${extension}`];
      }

      const fileHandle = await (window as any).showSaveFilePicker({
        suggestedName: filename,
        types: [{
          description: description,
          accept: accepts
        }]
      });
      
      const writable = await fileHandle.createWritable();
      await writable.write(blob);
      await writable.close();
      
      return true; // Successfully saved with Save As dialog
    } catch (err: any) {
      // User cancelled the save dialog
      if (err.name === 'AbortError') {
        console.log('User cancelled save dialog');
        return false;
      }
      console.warn('File System Access API failed, falling back to traditional download:', err);
      // Fall through to traditional download
    }
  }
  
  // Fallback: traditional download (all browsers)
  // Note: Whether a save dialog appears depends on browser settings
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  
  document.body.appendChild(a);
  a.click();
  
  // Cleanup
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
  
  return true; // Download initiated (traditional method)
}

/**
 * Download JSON data with Save As dialog
 */
export async function downloadJSON(data: any, filename: string): Promise<boolean> {
  return downloadWithSaveAs({
    filename,
    content: JSON.stringify(data, null, 2),
    mimeType: 'application/json',
    description: 'JSON files'
  });
}

/**
 * Download ZIP file with Save As dialog
 */
export async function downloadZIP(blob: Blob, filename: string): Promise<boolean> {
  return downloadWithSaveAs({
    filename,
    content: blob,
    mimeType: 'application/zip',
    description: 'ZIP archives'
  });
}

/**
 * Download text file with Save As dialog
 */
export async function downloadText(content: string, filename: string, mimeType = 'text/plain'): Promise<boolean> {
  return downloadWithSaveAs({
    filename,
    content,
    mimeType,
    description: 'Text files'
  });
}