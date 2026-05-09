/**
 * Utility functions for image handling and link conversion
 */

/**
 * Converts standard Google Drive sharing links into direct download/image links
 * that can be displayed in an <img> tag.
 * 
 * Supports:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/open?id=FILE_ID
 */
export const convertGoogleDriveLink = (url: string | null | undefined): string => {
  if (!url) return '';
  
  // Check if it's already a direct link or formatted correctly
  if (url.includes('drive.google.com/uc?')) return url;
  
  // Standard sharing link: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
  }
  
  // Sharing link variant: https://drive.google.com/open?id=FILE_ID
  const driveMatchAlt = url.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
  if (driveMatchAlt && driveMatchAlt[1]) {
    return `https://drive.google.com/uc?export=view&id=${driveMatchAlt[1]}`;
  }

  return url;
};
