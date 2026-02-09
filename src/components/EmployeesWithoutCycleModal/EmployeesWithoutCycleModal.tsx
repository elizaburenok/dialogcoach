import React, { useEffect, useRef, useState } from 'react';
import { Cell } from '../Cell';
import { Button } from '../Button';
import type { Employee } from '../../data/employees';
import './EmployeesWithoutCycleModal.css';

export interface EmployeesWithoutCycleModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** List of employees without a meeting cycle */
  employees: Employee[];
  /** Called when the modal should be closed */
  onClose: () => void;
  /** Called when the user confirms the choice of employee */
  onConfirm: (employeeId: string) => void;
}

const Radio: React.FC<{ checked?: boolean }> = ({ checked = false }) => (
  <div
    className={`employees-modal__radio ${checked ? 'employees-modal__radio--checked' : ''}`}
    aria-checked={checked}
    role="radio"
  />
);

export const EmployeesWithoutCycleModal: React.FC<EmployeesWithoutCycleModalProps> = (props) => {
  const { open, employees, onClose, onConfirm } = props;

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Reset local state when modal opens
  useEffect(() => {
    if (open) {
      setSelectedEmployeeId(null);
      setValidationError(null);
    }
  }, [open]);

  // Close on click outside and Escape
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const handleEmployeeSelect = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    if (validationError) {
      setValidationError(null);
    }
  };

  const handleConfirmClick = () => {
    if (!selectedEmployeeId) {
      setValidationError('Выберите сотрудника, чтобы продолжить');
      return;
    }

    onConfirm(selectedEmployeeId);
    onClose();
  };

  const hasEmployees = employees.length > 0;

  return (
    <div className="employees-modal__overlay">
      <div className="employees-modal" ref={modalRef}>
        <div className="employees-modal__header">
          <div className="employees-modal__navigation-bar">
            <div className="employees-modal__navigation-right">
              <button
                type="button"
                className="employees-modal__close"
                onClick={onClose}
                aria-label="Закрыть"
              >
                <span aria-hidden="true" className="employees-modal__close-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18 6L6 18M6 6l12 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>

          <div className="employees-modal__title-section">
            <h2 className="employees-modal__title">Выбрать сотрудника</h2>
          </div>
        </div>

        <div className="employees-modal__content">
          <div className="employees-modal__list" role="radiogroup">
            {hasEmployees ? (
              employees.map((employee) => {
                const fullName = `${employee.lastName} ${employee.firstName}`;
                const teamAndFocus = employee.channels.join(' · ');

                return (
                  <Cell
                    key={employee.id}
                    size="L"
                    variant="default"
                    subtitle={employee.role}
                    label={teamAndFocus}
                    onClick={() => handleEmployeeSelect(employee.id)}
                    icon={
                      <div
                        className="employees-modal__avatar"
                        style={{ backgroundColor: employee.avatarColor }}
                      >
                        <span className="employees-modal__avatar-text">
                          {employee.initials}
                        </span>
                      </div>
                    }
                    iconRight={<Radio checked={selectedEmployeeId === employee.id} />}
                  >
                    {fullName}
                  </Cell>
                );
              })
            ) : (
              <div className="employees-modal__empty">
                Нет сотрудников без цикла для выбора.
              </div>
            )}
          </div>
        </div>

        <div className="employees-modal__footer">
          {validationError && (
            <div className="employees-modal__validation" role="alert">
              {validationError}
            </div>
          )}
          <Button
            type="Primary"
            onClick={handleConfirmClick}
            className="employees-modal__confirm-button"
          >
            Создать активность
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmployeesWithoutCycleModal;

