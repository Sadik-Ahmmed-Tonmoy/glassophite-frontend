import { cn } from "@/lib/utils";
import React from "react";
import { FieldValues, FormProvider, SubmitHandler, useForm } from "react-hook-form";

type TFormProps = {
  children: React.ReactNode;
  className?: string;
  onSubmit: (data: FieldValues, reset: () => void) => void;
  // onSubmit: SubmitHandler<FieldValues>;
};
const MyFormWrapper = ({ children, onSubmit, className }: TFormProps) => {
  const methods = useForm<FieldValues>();

  const submit: SubmitHandler<FieldValues> = (data) => {
    onSubmit(data, methods.reset);
  };

  return (
    <FormProvider {...methods} >
      <form onSubmit={methods.handleSubmit(submit)} className={cn("", className)}>{children}</form>
    </FormProvider>
  );
};

export default MyFormWrapper;
