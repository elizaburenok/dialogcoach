import React, { useEffect, useRef, useState } from 'react';
import { Cell } from '../Cell';
import { Button } from '../Button';
import type { DialogCoach } from '../../data/employees';
import '../EmployeesWithoutCycleModal/EmployeesWithoutCycleModal.css';

export interface CoachSelectorModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** List of available dialog coaches */
  coaches: DialogCoach[];
  /** Currently selected coach id */
  selectedCoachId: string;
  /** Called when the modal should be closed */
  onClose: () => void;
  /** Called when the user confirms the choice of coach */
  onConfirm: (coachId: string) => void;
}

const Radio: React.FC<{ checked?: boolean }> = ({ checked = false }) => (
  <div
    className={`employees-modal__radio ${checked ? 'employees-modal__radio--checked' : ''}`}
    aria-checked={checked}
    role="radio"
  />
);

export const CoachSelectorModal: React.FC<CoachSelectorModalProps> = (props) => {
  const { open, coaches, selectedCoachId, onClose, onConfirm } = props;

  const [currentCoachId, setCurrentCoachId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Reset local state when modal opens
  useEffect(() => {
    if (open) {
      setCurrentCoachId(selectedCoachId ?? null);
      setValidationError(null);
    }
  }, [open, selectedCoachId]);

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

  const handleCoachSelect = (coachId: string) => {
    setCurrentCoachId(coachId);
    if (validationError) {
      setValidationError(null);
    }
  };

  const handleConfirmClick = () => {
    if (!currentCoachId) {
      setValidationError('Выберите диалог-коуча, чтобы продолжить');
      return;
    }

    onConfirm(currentCoachId);
  };

  const hasCoaches = coaches.length > 0;

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
            <h2 className="employees-modal__title">Выбрать диалог-коуча</h2>
          </div>
        </div>

        <div className="employees-modal__content">
          <div className="employees-modal__list" role="radiogroup">
            {hasCoaches ? (
              coaches.map((coach) => {
                const fullName = `${coach.lastName} ${coach.firstName} ${coach.patronymic}`;

                return (
                  <Cell
                    key={coach.id}
                    size="L"
                    variant="default"
                    subtitle={coach.description}
                    label={coach.label}
                    onClick={() => handleCoachSelect(coach.id)}
                    iconRight={<Radio checked={currentCoachId === coach.id} />}
                  >
                    {fullName}
                  </Cell>
                );
              })
            ) : (
              <div className="employees-modal__empty">
                Нет доступных диалог-коучей для выбора.
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
            Выбрать коуча
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CoachSelectorModal;

