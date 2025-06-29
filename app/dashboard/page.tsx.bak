import React from 'react';
import LegacyPage from './page-legacy';
import NewPage from './page-new';

const newDashboardEnabled = process.env.NEXT_PUBLIC_NEW_DASHBOARD === 'true';

export default function DashboardPage(props: any) {
  const PageComponent = newDashboardEnabled ? NewPage : LegacyPage;
  return <PageComponent {...props} />;
}
