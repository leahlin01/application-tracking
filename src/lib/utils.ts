import { ApplicationType, ApplicationStatus, DecisionType } from '@/types';

/**
 * 申请类型到翻译键的映射
 */
export const APPLICATION_TYPE_KEYS = {
  [ApplicationType.EARLY_DECISION]: 'application.types.earlyDecision',
  [ApplicationType.EARLY_ACTION]: 'application.types.earlyAction',
  [ApplicationType.REGULAR_DECISION]: 'application.types.regularDecision',
  [ApplicationType.ROLLING_ADMISSION]: 'application.types.rollingAdmission',
} as const;

/**
 * 申请状态到翻译键的映射
 */
export const APPLICATION_STATUS_KEYS = {
  [ApplicationStatus.NOT_STARTED]: 'application.statusOptions.notStarted',
  [ApplicationStatus.IN_PROGRESS]: 'application.statusOptions.inProgress',
  [ApplicationStatus.SUBMITTED]: 'application.statusOptions.submitted',
  [ApplicationStatus.UNDER_REVIEW]: 'application.statusOptions.underReview',
  [ApplicationStatus.DECIDED]: 'application.statusOptions.decided',
} as const;

/**
 * 决定类型到翻译键的映射
 */
export const DECISION_TYPE_KEYS = {
  [DecisionType.ACCEPTED]: 'application.decisionOptions.accepted',
  [DecisionType.REJECTED]: 'application.decisionOptions.rejected',
  [DecisionType.WAITLISTED]: 'application.decisionOptions.waitlisted',
  [DecisionType.DEFERRED]: 'application.decisionOptions.deferred',
} as const;

/**
 * 获取申请类型的翻译键
 */
export function getApplicationTypeKey(type: ApplicationType): string {
  return APPLICATION_TYPE_KEYS[type] || 'common.unknown';
}

/**
 * 获取申请状态的翻译键
 */
export function getApplicationStatusKey(status: ApplicationStatus): string {
  return APPLICATION_STATUS_KEYS[status] || 'common.unknown';
}

/**
 * 获取决定类型的翻译键
 */
export function getDecisionTypeKey(decision: DecisionType): string {
  return DECISION_TYPE_KEYS[decision] || 'common.unknown';
}

/**
 * 将申请类型枚举转换为中文显示（已废弃，请使用 getApplicationTypeKey + useTranslations）
 * @deprecated 请使用 getApplicationTypeKey 配合 useTranslations hook
 */
export function getApplicationTypeText(type: ApplicationType): string {
  switch (type) {
    case ApplicationType.EARLY_DECISION:
      return '早决定';
    case ApplicationType.EARLY_ACTION:
      return '早行动';
    case ApplicationType.REGULAR_DECISION:
      return '常规申请';
    case ApplicationType.ROLLING_ADMISSION:
      return '滚动录取';
    default:
      return '未知类型';
  }
}

/**
 * 将申请状态枚举转换为中文显示（已废弃，请使用 getApplicationStatusKey + useTranslations）
 * @deprecated 请使用 getApplicationStatusKey 配合 useTranslations hook
 */
export function getApplicationStatusText(status: ApplicationStatus): string {
  switch (status) {
    case ApplicationStatus.NOT_STARTED:
      return '未开始';
    case ApplicationStatus.IN_PROGRESS:
      return '进行中';
    case ApplicationStatus.SUBMITTED:
      return '已提交';
    case ApplicationStatus.UNDER_REVIEW:
      return '审核中';
    case ApplicationStatus.DECIDED:
      return '已决定';
    default:
      return '未知状态';
  }
}

/**
 * 将决定类型枚举转换为中文显示（已废弃，请使用 getDecisionTypeKey + useTranslations）
 * @deprecated 请使用 getDecisionTypeKey 配合 useTranslations hook
 */
export function getDecisionTypeText(decision: DecisionType): string {
  switch (decision) {
    case DecisionType.ACCEPTED:
      return '录取';
    case DecisionType.REJECTED:
      return '拒绝';
    case DecisionType.WAITLISTED:
      return '候补';
    case DecisionType.DEFERRED:
      return '延期';
    default:
      return '未知';
  }
}

/**
 * 获取申请类型的颜色样式
 */
export function getApplicationTypeColor(type: ApplicationType): string {
  switch (type) {
    case ApplicationType.EARLY_DECISION:
      return 'bg-red-100 text-red-800 border-red-200';
    case ApplicationType.EARLY_ACTION:
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case ApplicationType.REGULAR_DECISION:
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case ApplicationType.ROLLING_ADMISSION:
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

/**
 * 获取申请状态的颜色样式
 */
export function getApplicationStatusColor(status: ApplicationStatus): string {
  switch (status) {
    case ApplicationStatus.NOT_STARTED:
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case ApplicationStatus.IN_PROGRESS:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case ApplicationStatus.SUBMITTED:
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case ApplicationStatus.UNDER_REVIEW:
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case ApplicationStatus.DECIDED:
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

/**
 * 获取决定类型的颜色样式
 */
export function getDecisionTypeColor(decision: DecisionType): string {
  switch (decision) {
    case DecisionType.ACCEPTED:
      return 'bg-green-100 text-green-800 border-green-200';
    case DecisionType.REJECTED:
      return 'bg-red-100 text-red-800 border-red-200';
    case DecisionType.WAITLISTED:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case DecisionType.DEFERRED:
      return 'bg-orange-100 text-orange-800 border-orange-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

/**
 * 格式化日期显示
 */
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/**
 * 格式化货币显示
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD'
): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * 截断长文本
 */
export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * 生成唯一ID
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}
