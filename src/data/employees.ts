/**
 * Data types and mock data for the Dialog Coach meetings page
 */

export type MeetingCycle = 'weekly' | 'biweekly' | 'monthly' | 'noCycle';

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  patronymic: string;
  initials: string;
  avatarColor: string;
  role: string;
  channels: string[];
  nextMeetingDate: Date;
  cycle: MeetingCycle;
  /** Optional: shows a purple chip "С активностью работает <name>" */
  activeCoach?: string;
}

export interface DialogCoach {
  id: string;
  firstName: string;
  lastName: string;
  patronymic: string;
  isSelf: boolean;
  /** Short description of the coach role */
  description: string;
  /** Team / group label, e.g. "Налоговый джедай" */
  label: string;
}

export const cycleLabels: Record<MeetingCycle, string> = {
  weekly: 'Раз в неделю',
  biweekly: 'Раз в 2 недели',
  monthly: 'Раз в месяц',
  noCycle: 'Без цикла',
};

export const cycleLegendLabels: Record<MeetingCycle, string> = {
  weekly: 'Неделя',
  biweekly: '2 недели',
  monthly: 'Месяц',
  noCycle: 'Без цикла',
};

export const cycleColors: Record<MeetingCycle, string> = {
  // Weekly – sand category color
  weekly: 'var(--color-category-sand, #de9c7e)',
  // Every 2 weeks – sky category color
  biweekly: 'var(--color-category-sky, #82bad4)',
  // Monthly – flamingo category color
  monthly: 'var(--color-category-flamingo, #d796c1)',
  // No cycle – neutral gray
  noCycle: 'var(--color-bg-neutral-3, #e1e1e1)',
};

// ─── Mock Data ──────────────────────────────────────────────────────────────

export const mockEmployees: Employee[] = [
  {
    id: '1',
    firstName: 'Евгения',
    lastName: 'Иванова',
    patronymic: 'Алексеевна',
    initials: 'ИЕ',
    avatarColor: '#e59594',
    role: 'Дайвер',
    channels: ['Blocks', '[Команда]', 'Чат'],
    nextMeetingDate: new Date(2026, 1, 12), // 12 февраля
    cycle: 'weekly',
  },
  {
    id: '2',
    firstName: 'Алексей',
    lastName: 'Петров',
    patronymic: 'Сергеевич',
    initials: 'ПА',
    avatarColor: '#95aee2',
    role: 'Дайвер',
    channels: ['Blocks', '[Команда]', 'Чат + телефон'],
    nextMeetingDate: new Date(2026, 1, 15), // 15 февраля
    cycle: 'biweekly',
  },
  {
    id: '3',
    firstName: 'Ксения',
    lastName: 'Камойлова',
    patronymic: 'Дмитриевна',
    initials: 'КК',
    avatarColor: '#de9c7e',
    role: 'Дайвер',
    channels: ['Blocks', '[Команда]', 'Чат'],
    nextMeetingDate: new Date(2026, 1, 20), // 20 февраля
    cycle: 'monthly',
    activeCoach: 'Иванов Алексей',
  },
  {
    id: '4',
    firstName: 'Иван',
    lastName: 'Смирнов',
    patronymic: 'Павлович',
    initials: 'ИС',
    avatarColor: '#82bad4',
    role: 'Дайвер',
    channels: ['Blocks', '[Команда]', 'Чат'],
    nextMeetingDate: new Date(2026, 1, 22), // 22 февраля
    cycle: 'noCycle',
  },
  {
    id: '5',
    firstName: 'Мария',
    lastName: 'Кузнецова',
    patronymic: 'Игоревна',
    initials: 'МК',
    avatarColor: '#d796c1',
    role: 'Дайвер',
    channels: ['Blocks', '[Команда]', 'Чат'],
    nextMeetingDate: new Date(2026, 1, 25), // 25 февраля
    cycle: 'noCycle',
  },
];

export const mockCoaches: DialogCoach[] = [
  {
    id: 'coach-1',
    firstName: 'Александр',
    lastName: 'Константинопольский',
    patronymic: 'Игоревич',
    isSelf: true,
    description: 'Эксперт',
    label: 'Налоговый джедай',
  },
  {
    id: 'coach-2',
    firstName: 'Мария',
    lastName: 'Сидорова',
    patronymic: 'Павловна',
    isSelf: false,
    description: 'Эксперт',
    label: 'Команда роста выручки',
  },
  {
    id: 'coach-3',
    firstName: 'Дмитрий',
    lastName: 'Козлов',
    patronymic: 'Алексеевич',
    isSelf: false,
    description: 'Эксперт',
    label: 'Команда клиентского сервиса',
  },
  {
    id: 'coach-4',
    firstName: 'Ольга',
    lastName: 'Николаева',
    patronymic: 'Сергеевна',
    isSelf: false,
    description: 'Эксперт',
    label: 'Команда цифровых сервисов',
  },
];

/**
 * Alternative employee datasets for different dialog coaches.
 * The first coach reuses the default mockEmployees list.
 */
export const coachEmployeesMap: Record<string, Employee[]> = {
  'coach-1': mockEmployees,
  'coach-2': [
    {
      id: 'c2-1',
      firstName: 'Светлана',
      lastName: 'Громова',
      patronymic: 'Викторовна',
      initials: 'ГС',
      avatarColor: '#e5a77f',
      role: 'Финансовый аналитик',
      channels: ['Blocks', '[Команда]', 'Чат'],
      nextMeetingDate: new Date(2026, 2, 3),
      cycle: 'weekly',
    },
    {
      id: 'c2-2',
      firstName: 'Никита',
      lastName: 'Фролов',
      patronymic: 'Ильич',
      initials: 'ФН',
      avatarColor: '#8fb3e5',
      role: 'Кредитный эксперт',
      channels: ['Blocks', '[Команда]', 'Чат + телефон'],
      nextMeetingDate: new Date(2026, 2, 7),
      cycle: 'biweekly',
    },
    {
      id: 'c2-3',
      firstName: 'Анна',
      lastName: 'Чернова',
      patronymic: 'Олеговна',
      initials: 'ЧА',
      avatarColor: '#d89bc7',
      role: 'Специалист по рискам',
      channels: ['Blocks', '[Команда]'],
      nextMeetingDate: new Date(2026, 2, 11),
      cycle: 'monthly',
      activeCoach: 'Мария Сидорова',
    },
  ],
  'coach-3': [
    {
      id: 'c3-1',
      firstName: 'Татьяна',
      lastName: 'Романова',
      patronymic: 'Андреевна',
      initials: 'РТ',
      avatarColor: '#e5c07b',
      role: 'Оператор поддержки',
      channels: ['Blocks', '[Команда]', 'Чат'],
      nextMeetingDate: new Date(2026, 2, 2),
      cycle: 'weekly',
    },
    {
      id: 'c3-2',
      firstName: 'Вадим',
      lastName: 'Егоров',
      patronymic: 'Станиславович',
      initials: 'ЕВ',
      avatarColor: '#7fb8de',
      role: 'Старший оператор поддержки',
      channels: ['Blocks', '[Команда]', 'Чат + телефон'],
      nextMeetingDate: new Date(2026, 2, 6),
      cycle: 'biweekly',
      activeCoach: 'Дмитрий Козлов',
    },
    {
      id: 'c3-3',
      firstName: 'Инна',
      lastName: 'Соколова',
      patronymic: 'Романовна',
      initials: 'СИ',
      avatarColor: '#d999b8',
      role: 'Эксперт поддержки',
      channels: ['Blocks', '[Команда]'],
      nextMeetingDate: new Date(2026, 2, 9),
      cycle: 'monthly',
    },
    {
      id: 'c3-4',
      firstName: 'Максим',
      lastName: 'Орлов',
      patronymic: 'Игоревич',
      initials: 'ОМ',
      avatarColor: '#82bad4',
      role: 'Специалист по качеству',
      channels: ['Blocks', '[Команда]', 'Чат'],
      nextMeetingDate: new Date(2026, 2, 15),
      cycle: 'noCycle',
    },
  ],
  'coach-4': [
    {
      id: 'c4-1',
      firstName: 'Полина',
      lastName: 'Лебедева',
      patronymic: 'Михайловна',
      initials: 'ЛП',
      avatarColor: '#f0a8a8',
      role: 'Продакт-менеджер',
      channels: ['Blocks', '[Команда]'],
      nextMeetingDate: new Date(2026, 2, 4),
      cycle: 'weekly',
    },
    {
      id: 'c4-2',
      firstName: 'Григорий',
      lastName: 'Князев',
      patronymic: 'Дмитриевич',
      initials: 'КГ',
      avatarColor: '#9bc0f5',
      role: 'Бизнес-аналитик',
      channels: ['Blocks', '[Команда]', 'Чат'],
      nextMeetingDate: new Date(2026, 2, 8),
      cycle: 'biweekly',
    },
  ],
};

