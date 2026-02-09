import React from 'react';
import './Widget.css';

export interface WidgetProps {
  /** Widget heading text */
  title: string;
  /** Widget body content */
  children: React.ReactNode;
  /** Additional CSS class name */
  className?: string;
}

export const Widget: React.FC<WidgetProps> = ({
  title,
  children,
  className,
}) => {
  const classes = ['widget'];
  if (className) classes.push(className);

  return (
    <div className={classes.join(' ')}>
      <div className="widget__header">
        <h3 className="widget__title">{title}</h3>
      </div>
      <div className="widget__content">{children}</div>
    </div>
  );
};

export default Widget;
