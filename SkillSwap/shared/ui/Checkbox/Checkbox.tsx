import { forwardRef, useImperativeHandle, useRef, useEffect, type InputHTMLAttributes } from 'react';
import classes from './Checkbox.module.css';

export type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  indeterminate?: boolean;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = '', label, disabled, indeterminate, checked, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = !!indeterminate;
      }
    }, [indeterminate]);

    const rootClassName = `${classes.root} ${disabled ? classes.disabled : ''} ${className}`.trim();

    return (
      <label className={rootClassName}>
        <input
          {...props}
          ref={inputRef}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          className={classes.nativeInput}
        />
        
        <span className={classes.customIndicator} aria-hidden="true">
          {/* Пустой чекбокс (Unchecked) */}
          <svg 
            className={`${classes.icon} ${classes.iconUnchecked}`} 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://w3.org"
          >
            <path 
              fill="currentColor" 
              stroke="#000" 
              d="M9.209 2.5h5.582c2.468 0 4.11.53 5.145 1.564S21.5 6.741 21.5 9.21v5.582c0 2.468-.53 4.11-1.564 5.145S17.259 21.5 14.79 21.5H9.209c-2.468 0-4.11-.53-5.145-1.564S2.5 17.259 2.5 14.79V9.209c0-2.468.53-4.11 1.564-5.145S6.741 2.5 9.21 2.5Zm0 .396c-2.18 0-3.805.382-4.868 1.445S2.896 7.03 2.896 9.209v5.582c0 2.18.382 3.805 1.445 4.868s2.689 1.446 4.868 1.446h5.582c2.18 0 3.805-.383 4.868-1.446s1.446-2.689 1.446-4.868V9.209c0-2.18-.383-3.805-1.446-4.868s-2.689-1.445-4.868-1.445z"
            />
          </svg>

          {/* Чекбокс с галочкой (Checked) */}
          <svg 
            className={`${classes.icon} ${classes.iconCheck}`} 
            viewBox="0 0 20 20" 
            fill="none" 
            xmlns="http://w3.org"
          >
            <path 
              fill="currentColor" 
              d="M12.791 0C17.841 0 20 2.158 20 7.209v5.582C20 17.841 17.842 20 12.791 20H7.209C2.159 20 0 17.842 0 12.791V7.209C0 2.159 2.158 0 7.209 0zm1.99 6.63a.755.755 0 0 0-1.061 0l-5.14 5.14-2.3-2.3a.755.755 0 0 0-1.06 0c-.29.29-.29.77 0 1.06l2.83 2.83a.75.75 0 0 0 1.06 0l5.67-5.67c.29-.29.29-.77 0-1.06"
            />
          </svg>

          {/* Чекбокс с минусом (Indeterminate) */}
          <svg 
            className={`${classes.icon} ${classes.iconIndeterminate}`} 
            viewBox="0 0 20 20" 
            fill="none" 
            xmlns="http://w3.org"
          >
            <path 
              fill="currentColor" 
              d="M12.791 0C17.841 0 20 2.158 20 7.209v5.582C20 17.841 17.842 20 12.791 20H7.209C2.159 20 0 17.842 0 12.791V7.209C0 2.159 2.158 0 7.209 0zM6 9.25c-.41 0-.75.34-.75.75s.34.75.75.75h8c.41 0 .75-.34.75-.75s-.34-.75-.75-.75z"
            />
          </svg>
        </span>
        
        {label && <span className={classes.labelText}>{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';