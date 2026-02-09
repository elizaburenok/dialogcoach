import React from 'react';
import {
  type MeetingCycle,
  type Employee,
  cycleColors,
  cycleLegendLabels,
} from '../../data/employees';
import './SegmentBar.css';

export interface SegmentBarProps {
  /** Employees to calculate distribution from */
  employees: Employee[];
  /** Additional CSS class name */
  className?: string;
}

interface SegmentData {
  cycle: MeetingCycle;
  count: number;
  percentage: number;
  color: string;
  label: string;
}

/**
 * Calculate segment data from employee list.
 * Only includes cycles that have at least 1 employee.
 */
function getSegments(employees: Employee[]): SegmentData[] {
  const cycleOrder: MeetingCycle[] = ['weekly', 'biweekly', 'monthly', 'noCycle'];
  const counts: Record<MeetingCycle, number> = {
    weekly: 0,
    biweekly: 0,
    monthly: 0,
    noCycle: 0,
  };

  employees.forEach((emp) => {
    counts[emp.cycle]++;
  });

  const total = employees.length;

  return cycleOrder
    .filter((cycle) => counts[cycle] > 0)
    .map((cycle) => ({
      cycle,
      count: counts[cycle],
      percentage: total > 0 ? (counts[cycle] / total) * 100 : 0,
      color: cycleColors[cycle],
      label: cycleLegendLabels[cycle],
    }));
}

function pluralizeEmployees(count: number): string {
  const lastTwo = count % 100;
  const lastOne = count % 10;

  if (lastTwo >= 11 && lastTwo <= 19) return `${count} сотрудников`;
  if (lastOne === 1) return `${count} сотрудник`;
  if (lastOne >= 2 && lastOne <= 4) return `${count} сотрудника`;
  return `${count} сотрудников`;
}

export const SegmentBar: React.FC<SegmentBarProps> = ({
  employees,
  className,
}) => {
  const segments = getSegments(employees);
  const total = employees.length;

  const classes = ['segment-bar'];
  if (className) classes.push(className);

  return (
    <div className={classes.join(' ')}>
      {/* Header: "В работе" + count */}
      <div className="segment-bar__header">
        <span className="segment-bar__header-label">В работе</span>
        <span className="segment-bar__header-count">
          {pluralizeEmployees(total)}
        </span>
      </div>

      {/* Stacked horizontal bar */}
      <div className="segment-bar__bar">
        {segments.map((seg) => (
          <div
            key={seg.cycle}
            className="segment-bar__bar-segment"
            style={{
              width: `${seg.percentage}%`,
              backgroundColor: seg.color,
            }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="segment-bar__legend">
        {segments.map((seg) => (
          <div key={seg.cycle} className="segment-bar__legend-item">
            <span
              className="segment-bar__legend-dot"
              style={{ backgroundColor: seg.color }}
            />
            <span className="segment-bar__legend-text">
              {seg.label}, {seg.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SegmentBar;
