'use client';

import MainApplication from '@/components/MainApplication';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// 主应用内容组件

// 主页面组件，包含权限保护
export default function Home() {
  return (
    <ProtectedRoute>
      <MainApplication />
    </ProtectedRoute>
  );
}
