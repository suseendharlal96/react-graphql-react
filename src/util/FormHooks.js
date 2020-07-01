import { useState } from "react";

export const useForm = (callback, initState) => {
  const [formValue, setFormValue] = useState(initState);

  const onChangeInput = (e) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    callback();
  };

  return {
    formValue,
    onChangeInput,
    onSubmit,
  };
};
