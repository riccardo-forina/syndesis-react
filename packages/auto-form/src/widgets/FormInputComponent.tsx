import * as React from 'react';

export const FormInputComponent = ({
  field,
  type,
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
      <input
        type={type}
        id={field.name}
        data-testid={field.name}
        disabled={isSubmitting}
        {...field}
      />
      {touched[field.name] && errors[field.name] && (
        <div className="error">{errors[field.name]}</div>
      )}
    </div>
  </div>
);
