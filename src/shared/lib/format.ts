export function toSentenceCase(value: string) {
  const normalized = value.replace(/[_-]+/g, ' ').trim();
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('ru-RU').format(value);
}

export function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

const requestStatusLabels: Record<string, string> = {
  new: 'Новая',
  in_progress: 'В работе',
  pending: 'Ожидает',
  completed: 'Завершено',
  overdue: 'Просрочено',
  rejected: 'Отклонено',
};

const requestPriorityLabels: Record<string, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
  critical: 'Критический',
};

const requestCategoryLabels: Record<string, string> = {
  waste_management: 'Вывоз мусора',
  ecology: 'Экология',
  infrastructure: 'Инфраструктура',
  complaint: 'Жалоба',
  consultation: 'Консультация',
  other: 'Другое',
};

const citizenSocialStatusLabels: Record<string, string> = {
  employed: 'Работает',
  unemployed: 'Безработный',
  retired: 'Пенсионер',
  student: 'Студент',
  vulnerable: 'Социально уязвимый',
};

const citizenEducationLevelLabels: Record<string, string> = {
  secondary: 'Среднее',
  vocational: 'Среднее специальное',
  bachelor: 'Бакалавр',
  master: 'Магистр',
  phd: 'Кандидат/доктор наук',
};

const citizenEmploymentStatusLabels: Record<string, string> = {
  employed: 'Трудоустроен',
  unemployed: 'Не трудоустроен',
  self_employed: 'Самозанятый',
  retired: 'На пенсии',
  student: 'Студент',
};

const citizenFamilyStatusLabels: Record<string, string> = {
  single: 'Не женат/не замужем',
  married: 'В браке',
  divorced: 'Разведён(а)',
  widowed: 'Вдовец/вдова',
  with_children: 'С детьми',
};

const citizenGenderLabels: Record<string, string> = {
  male: 'Мужской',
  female: 'Женский',
};

export function formatRequestStatus(value: string) {
  return requestStatusLabels[value] ?? value;
}

export function formatRequestPriority(value: string) {
  return requestPriorityLabels[value] ?? value;
}

export function formatRequestCategory(value: string) {
  return requestCategoryLabels[value] ?? value;
}

export function formatCitizenSocialStatus(value: string) {
  return citizenSocialStatusLabels[value] ?? value;
}

export function formatCitizenEducationLevel(value: string) {
  return citizenEducationLevelLabels[value] ?? value;
}

export function formatCitizenEmploymentStatus(value: string) {
  return citizenEmploymentStatusLabels[value] ?? value;
}

export function formatCitizenFamilyStatus(value: string) {
  return citizenFamilyStatusLabels[value] ?? value;
}

export function formatCitizenGender(value: string) {
  return citizenGenderLabels[value] ?? value;
}
