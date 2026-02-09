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
import { coachEmployeesMap, mockEmployees, mockCoaches } from './data/employees';
import './App.css';

function formatMeetingDateShort(date: Date): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
  }).format(date);
}

export function App() {
  const [selectedCoach, setSelectedCoach] = useState(mockCoaches[0]);
  const [employees, setEmployees] = useState(
    coachEmployeesMap[mockCoaches[0].id] ?? mockEmployees
  );
  const [isEmployeesModalOpen, setIsEmployeesModalOpen] = useState(false);
  const [isCoachModalOpen, setIsCoachModalOpen] = useState(false);

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

  // Employees sorted by next meeting date (soonest first)
  const sortedEmployees = useMemo(
    () =>
      [...employees].sort(
        (a, b) => a.nextMeetingDate.getTime() - b.nextMeetingDate.getTime()
      ),
    [employees]
  );

  const employeesWithoutCycle = useMemo(
    () => employees.filter((employee) => employee.cycle === 'noCycle'),
    [employees]
  );

  const employeesWithoutCycleCount = employeesWithoutCycle.length;

  // Only show employees with an active cycle in the list
  const visibleEmployees = useMemo(
    () => sortedEmployees.filter((employee) => employee.cycle !== 'noCycle'),
    [sortedEmployees]
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
