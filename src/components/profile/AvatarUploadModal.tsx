import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Sparkles, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
    generateDiceBearUrl,
    generateRandomSeed,
    compressImage,
    validateImageFile,
} from '@/utils/avatar.utils';
import { uploadAvatar, updateAvatarUrl } from '@/services/auth.service';
import { useUser } from '@/contexts/UserContext';

interface AvatarUploadModalProps {
    open: boolean;
    onClose: () => void;
    currentAvatarUrl?: string;
    userName: string;
    onAvatarUpdated?: () => void;
}

const DICEBEAR_STYLES = [
    { value: 'avataaars', label: 'Avataaars' },
    { value: 'bottts', label: 'Bottts' },
    { value: 'identicon', label: 'Identicon' },
    { value: 'pixel-art', label: 'Pixel Art' },
] as const;

export function AvatarUploadModal({
    open,
    onClose,
    currentAvatarUrl,
    userName,
    onAvatarUpdated,
}: AvatarUploadModalProps) {
    const { user, updateAvatar: updateAvatarInContext, refreshProfile } = useUser();
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string>(currentAvatarUrl || '');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [diceBearSeed, setDiceBearSeed] = useState(userName || generateRandomSeed());
    const [diceBearStyle, setDiceBearStyle] = useState<typeof DICEBEAR_STYLES[number]['value']>('avataaars');

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const validation = validateImageFile(file);
        if (!validation.valid) {
            toast({
                title: 'Invalid File',
                description: validation.error,
                variant: 'destructive',
            });
            return;
        }

        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const file = e.dataTransfer.files?.[0];
        if (!file) return;

        const validation = validateImageFile(file);
        if (!validation.valid) {
            toast({
                title: 'Invalid File',
                description: validation.error,
                variant: 'destructive',
            });
            return;
        }

        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleGenerateDiceBear = () => {
        const url = generateDiceBearUrl(diceBearSeed, diceBearStyle);
        setPreviewUrl(url);
        setSelectedFile(null);
    };

    const handleRandomize = () => {
        const newSeed = generateRandomSeed();
        setDiceBearSeed(newSeed);
        const url = generateDiceBearUrl(newSeed, diceBearStyle);
        setPreviewUrl(url);
        setSelectedFile(null);
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            if (!user) throw new Error('User not authenticated');

            let avatarUrl = previewUrl;

            // If uploading a file, compress and upload it
            if (selectedFile) {
                const compressed = await compressImage(selectedFile);
                avatarUrl = await uploadAvatar(user.id, compressed);
            }

            // Update profile with new avatar URL
            await updateAvatarUrl(user.id, avatarUrl);

            // Update avatar in context for immediate UI update
            updateAvatarInContext(avatarUrl);

            // Refresh profile to ensure consistency
            await refreshProfile();

            toast({
                title: 'Avatar Updated',
                description: 'Your avatar has been updated successfully!',
            });

            onAvatarUpdated?.();
            onClose();
        } catch (error: any) {
            console.error('Error updating avatar:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to update avatar',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Change Avatar</DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="upload" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="upload">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload
                        </TabsTrigger>
                        <TabsTrigger value="generate">
                            <Sparkles className="w-4 h-4 mr-2" />
                            Generate
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="upload" className="space-y-4">
                        <div
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
                            onClick={() => document.getElementById('avatar-upload')?.click()}
                        >
                            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground mb-2">
                                Drag and drop an image, or click to browse
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Supports: JPG, PNG, GIF, WebP (Max 5MB)
                            </p>
                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="generate" className="space-y-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Avatar Style</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {DICEBEAR_STYLES.map((style) => (
                                        <Button
                                            key={style.value}
                                            type="button"
                                            variant={diceBearStyle === style.value ? 'default' : 'outline'}
                                            onClick={() => {
                                                setDiceBearStyle(style.value);
                                                handleGenerateDiceBear();
                                            }}
                                            className="w-full"
                                        >
                                            {style.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleRandomize}
                                className="w-full"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Randomize
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Preview */}
                {previewUrl && (
                    <div className="space-y-2">
                        <Label>Preview</Label>
                        <div className="flex justify-center">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-border">
                                <img
                                    src={previewUrl}
                                    alt="Avatar preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={handleSave} disabled={loading || !previewUrl}>
                        {loading ? 'Saving...' : 'Save Avatar'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
