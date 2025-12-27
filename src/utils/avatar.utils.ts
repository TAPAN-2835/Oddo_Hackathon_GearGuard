/**
 * Avatar utility functions for GearGuard
 * Handles DiceBear avatar generation, image compression, and avatar URL management
 */

/**
 * Generate a DiceBear avatar URL
 * @param seed - Unique identifier (username, email, or random string)
 * @param style - DiceBear style (avataaars, bottts, identicon, etc.)
 * @returns DiceBear avatar URL
 */
export function generateDiceBearUrl(
    seed: string,
    style: 'avataaars' | 'bottts' | 'identicon' | 'initials' | 'pixel-art' = 'avataaars'
): string {
    const encodedSeed = encodeURIComponent(seed);
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodedSeed}`;
}

/**
 * Generate a random seed for DiceBear
 */
export function generateRandomSeed(): string {
    return Math.random().toString(36).substring(2, 15);
}

/**
 * Compress an image file
 * @param file - Image file to compress
 * @param maxWidth - Maximum width in pixels
 * @param maxHeight - Maximum height in pixels
 * @param quality - JPEG quality (0-1)
 * @returns Compressed image as Blob
 */
export async function compressImage(
    file: File,
    maxWidth: number = 400,
    maxHeight: number = 400,
    quality: number = 0.8
): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Calculate new dimensions
                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Failed to get canvas context'));
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error('Failed to compress image'));
                        }
                    },
                    'image/jpeg',
                    quality
                );
            };
            img.onerror = () => reject(new Error('Failed to load image'));
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
    });
}

/**
 * Validate image file
 * @param file - File to validate
 * @param maxSizeMB - Maximum file size in MB
 * @returns Validation result
 */
export function validateImageFile(
    file: File,
    maxSizeMB: number = 5
): { valid: boolean; error?: string } {
    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        return {
            valid: false,
            error: 'Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.',
        };
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
        return {
            valid: false,
            error: `File size exceeds ${maxSizeMB}MB. Please choose a smaller image.`,
        };
    }

    return { valid: true };
}

/**
 * Get initials from a name
 * @param name - Full name
 * @returns Initials (2 characters)
 */
export function getInitials(name: string): string {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

/**
 * Get avatar URL with fallback
 * @param avatarUrl - User's avatar URL
 * @param name - User's name (for fallback)
 * @returns Avatar URL or DiceBear fallback
 */
export function getAvatarUrl(avatarUrl: string | null | undefined, name: string): string {
    if (avatarUrl && avatarUrl.trim()) {
        return avatarUrl;
    }
    // Generate DiceBear avatar as fallback
    return generateDiceBearUrl(name || 'user', 'avataaars');
}
