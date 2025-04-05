'use client';

import { UploadDropzone } from '@/lib/uploadthing';
import { toast } from 'sonner';
import { ourFileRouter } from '@/app/api/uploadthing/core';

interface FileUploadProps {
  onChange: (url?: string) => void;
  endpoint: keyof typeof ourFileRouter;
}

export const FileUpload = ({ onChange, endpoint }: FileUploadProps) => {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0]?.url); // Changed from ufsUrl to url
      }}
      onUploadError={(error: Error) => {
        toast.error(`Upload failed: ${error.message}`);
      }}
      onUploadBegin={() => {
        toast.info('Upload started...');
      }}
      config={{
        mode: 'auto',
      }}
      appearance={{
        container: 'border-2 border-dashed cursor-pointer',
        uploadIcon: 'text-primary',
        label: 'text-primary hover:text-primary/80',
        button: 'bg-primary hover:bg-primary/90',
        allowedContent: 'text-muted-foreground',
      }}
    />
  );
};