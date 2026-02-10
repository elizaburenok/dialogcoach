import React, { useEffect, useMemo, useState } from 'react';
import { NavigationBar } from './components/NavigationBar';
import { Chip } from './components/Chip';
import { Cell } from './components/Cell';
import { PageAction } from './components/PageAction';
import { EmployeeCell } from './components/EmployeeCell';
import { SegmentBar } from './components/SegmentBar';
import { Widget } from './components/Widget';
import { ContextualNotification } from './components/ContextualNotification';
import { EmployeesWithoutCycleModal } from './components/EmployeesWithoutCycleModal';
import { CoachSelectorModal } from './components/CoachSelectorModal';
import { Button } from './components/Button';
import { SearchInput } from './components/SearchInput';
import {
  coachEmployeesMap,
  mockEmployees,
  mockCoaches,
  type Employee,
  type MeetingCycle,
} from './data/employees';
import './App.css';

function formatMeetingDateShort(date: Date): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
  }).format(date);
}

/**
 * Generate synthetic employees for demonstration purposes.
 * Used only for coach "Константинопольский Александр" (coach-1).
 */
function generateSyntheticEmployeesForCoach(
  baseEmployees: Employee[],
  count: number
): Employee[] {
  if (!baseEmployees.length || count <= 0) {
    return [];
  }

  const existingIds = new Set(baseEmployees.map((employee) => employee.id));

  const baseDate = baseEmployees.reduce((min, employee) => {
    return employee.nextMeetingDate.getTime() < min.getTime()
      ? employee.nextMeetingDate
      : min;
  }, baseEmployees[0].nextMeetingDate);

  const cycles: MeetingCycle[] = ['weekly', 'biweekly', 'monthly'];
  const firstNames = ['Олег', 'Наталья', 'Фёдор', 'Софья', 'Роман', 'Елена'];
  const lastNames = ['Александров', 'Борисова', 'Карпов', 'Лебедев', 'Орлова'];
  const patronymics = [
    'Игоревич',
    'Алексеевна',
    'Павлович',
    'Сергеевна',
    'Дмитриевна',
  ];
  const avatarColors = ['#e59594', '#95aee2', '#de9c7e', '#82bad4', '#d796c1'];
  const channelsOptions: string[][] = [
    ['Blocks', '[Команда]', 'Чат'],
    ['Blocks', '[Команда]', 'Чат + телефон'],
  ];

  const syntheticEmployees: Employee[] = [];

  for (let index = 0; index < count; index++) {
    const firstName =
      firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const patronymic =
      patronymics[Math.floor(Math.random() * patronymics.length)];
    const initials = `${lastName[0] ?? ''}${firstName[0] ?? ''}`;
    const avatarColor =
      avatarColors[Math.floor(Math.random() * avatarColors.length)];
    const channels =
      channelsOptions[Math.floor(Math.random() * channelsOptions.length)];
    const cycle = cycles[index % cycles.length];

    // Spread meetings roughly across the month after the earliest meeting
    const offsetDays = 1 + ((index * 3) % 28);
    const nextMeetingDate = new Date(baseDate);
    nextMeetingDate.setDate(baseDate.getDate() + offsetDays);

    let id = `synthetic-${index + 1}`;
    while (existingIds.has(id)) {
      id = `synthetic-${id}`;
    }
    existingIds.add(id);

    syntheticEmployees.push({
      id,
      firstName,
      lastName,
      patronymic,
      initials,
      avatarColor,
      role: 'Дайвер',
      channels,
      nextMeetingDate,
      cycle,
    });
  }

  return syntheticEmployees;
}

export function App() {
  const [selectedCoach, setSelectedCoach] = useState(mockCoaches[0]);
  const [employees, setEmployees] = useState(
    coachEmployeesMap[mockCoaches[0].id] ?? mockEmployees
  );
  const [isEmployeesModalOpen, setIsEmployeesModalOpen] = useState(false);
  const [isCoachModalOpen, setIsCoachModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // #region agent log
  useEffect(() => {
    fetch('http://127.0.0.1:7243/ingest/0fd66834-7408-4585-badd-cfcda61391b4', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        runId: 'pre-fix',
        hypothesisId: 'H4',
        location: 'src/App.tsx:25',
        message: 'App mounted with initial state',
        data: {
          employeesCount: employees.length,
          coach: { id: selectedCoach.id, isSelf: selectedCoach.isSelf },
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
  }, [employees.length, selectedCoach.id, selectedCoach.isSelf]);
  // #endregion

  // Employees (including synthetic demo employees for coach-1) sorted by next meeting date (soonest first)
  const sortedEmployees = useMemo(() => {
    let extendedEmployees: Employee[] = employees;

    if (selectedCoach.id === 'coach-1') {
      const syntheticEmployees = generateSyntheticEmployeesForCoach(
        employees,
        10
      );
      extendedEmployees = [...employees, ...syntheticEmployees];
    }

    return [...extendedEmployees].sort(
      (a, b) => a.nextMeetingDate.getTime() - b.nextMeetingDate.getTime()
    );
  }, [employees, selectedCoach.id]);

  const employeesWithoutCycle = useMemo(
    () => employees.filter((employee) => employee.cycle === 'noCycle'),
    [employees]
  );

  const employeesWithoutCycleCount = employeesWithoutCycle.length;

  const nameFilteredEmployees = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return sortedEmployees;
    }

    return sortedEmployees.filter((employee) => {
      const fullName = `${employee.lastName} ${employee.firstName} ${employee.patronymic ?? ''}`.toLowerCase();
      return fullName.includes(query);
    });
  }, [sortedEmployees, searchQuery]);

  // Only show employees with an active cycle in the list
  const visibleEmployees = useMemo(
    () => nameFilteredEmployees.filter((employee) => employee.cycle !== 'noCycle'),
    [nameFilteredEmployees]
  );

  const coachDisplayName = `${selectedCoach.lastName}\n${selectedCoach.firstName}`;

  const handleOpenCoachModal = () => {
    setIsCoachModalOpen(true);
  };

  const handleCloseCoachModal = () => {
    setIsCoachModalOpen(false);
  };

  const handleConfirmCoach = (coachId: string) => {
    const coach = mockCoaches.find((item) => item.id === coachId);
    if (!coach) {
      setIsCoachModalOpen(false);
      return;
    }

    setSelectedCoach(coach);
    const nextEmployees = coachEmployeesMap[coach.id] ?? mockEmployees;
    setEmployees(nextEmployees);
    setIsCoachModalOpen(false);
  };

  const handleResetCoach = () => {
    const defaultCoach = mockCoaches[0];
    setSelectedCoach(defaultCoach);
    const defaultEmployees = coachEmployeesMap[defaultCoach.id] ?? mockEmployees;
    setEmployees(defaultEmployees);
  };

  const handleOpenEmployeesModal = () => {
    setIsEmployeesModalOpen(true);
  };

  const handleCloseEmployeesModal = () => {
    setIsEmployeesModalOpen(false);
  };

  const handleConfirmEmployee = (employeeId: string) => {
    setEmployees((prev) =>
      prev.map((employee) =>
        employee.id === employeeId ? { ...employee, cycle: 'weekly' } : employee
      )
    );
  };

  return (
    <div className="page">
      {/* ── Left Column: Navigation ── */}
      <div className="page__left">
        <NavigationBar
          hasBackButton
          hasTextBlock
          title="Список сотрудников"
          onBackClick={() => {}}
        />
      </div>

      {/* ── Center Column: Filters + Employee List ── */}
      <div className="page__center">
        <div className="page__notification">
          <ContextualNotification
            countWithoutCycle={employeesWithoutCycleCount}
            onOpenAssignModal={handleOpenEmployeesModal}
            showActionButton={selectedCoach.id === 'coach-1'}
          />
        </div>

        {/* Search Input */}
        <div className="page__search">
          <SearchInput
            size="m"
            variant="filled"
            placeholder="Поиск по имени"
            value={searchQuery}
            onValueChange={setSearchQuery}
            iconLeft={
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="8"
                  cy="8"
                  r="5.25"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M12.5 12.5L15 15"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            }
          />
        </div>

        {/* Filter Chips */}
        <div className="page__filters">
          <Chip variant="dropdown" label="Роль" />
          <Chip variant="dropdown" label="Фокус" />
        </div>

        {/* Employee List */}
        <div className="page__list">
          {visibleEmployees.map((employee) => (
            <EmployeeCell key={employee.id} employee={employee} />
          ))}
        </div>
      </div>

      {/* ── Right Column: Widgets ── */}
      <div className="page__right">
        {/* Periodicity Widget */}
        <Widget title="Периодичность">
          <SegmentBar employees={sortedEmployees} />
        </Widget>

        {/* Dialog Coach Widget */}
        <Widget title="Диалог-коуч">
          <Cell
            size="M"
            onClick={handleOpenCoachModal}
            iconRight={
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.75 13.5L11.25 9L6.75 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
            label={
              selectedCoach.isSelf
                ? 'Ты смотришь своих сотрудников'
                : 'Ты смотришь сотрудников другого диалог-коуча'
            }
          >
            {coachDisplayName}
          </Cell>
          {selectedCoach.id !== 'coach-1' && (
            <Button
              type="BrandSubtle"
              size="S"
              className="widget__reset-button"
              onClick={handleResetCoach}
            >
              Сбросить
            </Button>
          )}
        </Widget>

        {/* Page Action */}
        <PageAction
          title="Все мои активности"
          description="Посмотреть загрузку"
          iconLeft={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15 3H21V9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 14L21 3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
          onClick={() => {}}
        />
      </div>
      <EmployeesWithoutCycleModal
        open={isEmployeesModalOpen}
        employees={employeesWithoutCycle}
        onClose={handleCloseEmployeesModal}
        onConfirm={handleConfirmEmployee}
      />
      <CoachSelectorModal
        open={isCoachModalOpen}
        coaches={mockCoaches}
        selectedCoachId={selectedCoach.id}
        onClose={handleCloseCoachModal}
        onConfirm={handleConfirmCoach}
      />
    </div>
  );
}
