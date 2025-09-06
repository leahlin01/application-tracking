import { redirect } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function RootPage() {
  const locale = useLocale();
  // 重定向到默认语言
  redirect(`/${locale}`);
}
