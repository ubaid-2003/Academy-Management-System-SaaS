'use client';

import { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Global Providers wrapper.
 * Currently no Redux or context used.
 * Can be extended later if needed.
 */
export default function Providers({ children }: ProvidersProps) {
  return <>{children}</>;
}
