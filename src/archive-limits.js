// Large original MUGEN sprite banks can exceed 128 MiB compressed.
// Preserve the independent 512 MiB expanded and 5,000-entry safety limits.
export const MAX_ARCHIVE_BYTES=256*1024*1024;
export const MAX_ZIP_BYTES=MAX_ARCHIVE_BYTES;
export const MAX_EXPANDED_BYTES=512*1024*1024;
export const MAX_ARCHIVE_FILES=5000;
export const ARCHIVE_LIMIT_MB=MAX_ARCHIVE_BYTES/(1024*1024);
export const ZIP_LIMIT_MB=ARCHIVE_LIMIT_MB;
