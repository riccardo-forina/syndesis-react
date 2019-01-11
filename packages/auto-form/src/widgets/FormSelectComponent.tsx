import * as React from 'react';

export const FormSelectComponent = ({
  field,
  form: { touched, errors, isSubmitting },
  ...props
}: {
  [name: string]: any;
}) => (
  // TODO replace with PF3/PF4 widget
  <div className="form-group">
    <label className="col-sm-2 control-label" htmlFor={field.name}>
      {props.property.displayName}
    </label>
    <div className="col-sm-10">
      <select
        id={field.name}
        data-testid={field.name}
        disabled={isSubmitting}
        {...field}
      >
        {props.property.enum.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {touched[field.name] && errors[field.name] && (
        <div className="error">{errors[field.name]}</div>
      )}
    </div>
  </div>
);
