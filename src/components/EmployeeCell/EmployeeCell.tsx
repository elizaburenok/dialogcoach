import React from 'react';
import { type Employee, cycleLabels } from '../../data/employees';
import { Cell } from '../Cell';
import './EmployeeCell.css';

export interface EmployeeCellProps {
  /** Employee data */
  employee: Employee;
  /** Click handler */
  onClick?: (employee: Employee) => void;
  /** Additional CSS class name */
  className?: string;
}

/**
 * Format a date as "DD месяца" in Russian, e.g. "12 февраля"
 */
function formatMeetingDate(date: Date): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
  }).format(date);
}

export const EmployeeCell: React.FC<EmployeeCellProps> = ({
  employee,
  onClick,
  className,
}) => {
  const classes = ['employee-cell'];
  if (className) classes.push(className);

  return (
    <Cell
      size="L"
      className={classes.join(' ')}
      onClick={onClick ? () => onClick(employee) : undefined}
    >
      {/* Left: Avatar */}
      <div
        className="employee-cell__avatar"
        style={{ backgroundColor: employee.avatarColor }}
      >
        <span className="employee-cell__avatar-text">{employee.initials}</span>
      </div>

      {/* Center: Info */}
      <div className="employee-cell__info">
        <span className="employee-cell__role">{employee.role}</span>
        <span className="employee-cell__name">
          {employee.lastName} {employee.firstName} {employee.patronymic}
        </span>
        <span className="employee-cell__channels">
          {employee.channels.join(', ')}
        </span>
        {employee.activeCoach && (
          <div className="employee-cell__active-chip">
            <span className="employee-cell__active-chip-text">
              С активностью работает {employee.activeCoach}
            </span>
          </div>
        )}
      </div>

      {/* Right: Date & cycle */}
      <div className="employee-cell__date-block">
        <span className="employee-cell__date">
          {formatMeetingDate(employee.nextMeetingDate)}
        </span>
        <span className="employee-cell__cycle">
          {cycleLabels[employee.cycle]}
        </span>
      </div>
    </Cell>
  );
};

export default EmployeeCell;
