
// src/components/ui/radio-group.jsx
import React from 'react';

export const RadioGroup = ({ value, onValueChange, className, children }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { 
          checked: child.props.value === value,
          onChange: () => onValueChange(child.props.value)
        })
      )}
    </div>
  );
};

export const RadioGroupItem = ({ id, value, checked, onChange }) => {
  return (
    <div className="flex items-center">
      <input
        type="radio"
        id={id}
        value={value}
        checked={checked}
        onChange={onChange}
        className="mr-2"
      />
    </div>
  );
};