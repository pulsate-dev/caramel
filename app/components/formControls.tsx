import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function TextField({ label, id, ...props }: TextFieldProps) {
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input id={id} {...props} />
    </>
  );
}

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
};

export function TextArea({ label, id, ...props }: TextAreaProps) {
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <textarea id={id} {...props} />
    </>
  );
}

type SubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function SubmitButton(props: SubmitButtonProps) {
  return <button type="submit" {...props} />;
}

type FormErrorProps = {
  children: React.ReactNode;
  className?: string;
};

export function FormError({ children, className }: FormErrorProps) {
  return (
    <p role="alert" className={className}>
      {children}
    </p>
  );
}
