// project/app/api-docs/page.tsx
'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function ApiDocs() {
  const [spec, setSpec] = useState(null);

  useEffect(() => {
    fetch('/api/swagger')
      .then((response) => response.json())
      .then((data) => setSpec(data));
  }, []);

  if (!spec) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <SwaggerUI spec={spec} />
    </div>
  );
}