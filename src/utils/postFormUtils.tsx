// src/utils/postFormUtils.ts
import { FormValues } from "../types";
import * as Yup from "yup";

export const getInitialValues = (extraFields: string[]): FormValues => {
  const baseValues = {
    title: "",
    views: "",
    author: "",
    category: "",
    status: "",
  };

  return extraFields.reduce(
    (acc, key) => ({
      ...acc,
      [key]: "",
    }),
    baseValues
  );
};

export const getValidationSchema = (extraFields: string[]) => {
  return Yup.object({
    title: Yup.string().required("Обязательное поле"),
    views: Yup.number()
      .typeError("Должно быть числом")
      .required("Обязательное поле")
      .min(0, "Не может быть отрицательным"),
    author: Yup.string().required("Укажите автора"),
    category: Yup.string().required("Выберите категорию"),
    status: Yup.string().required("Укажите статус"),
    ...extraFields.reduce(
      (acc, key) => ({
        ...acc,
        [key]: Yup.string().notRequired(),
      }),
      {}
    ),
  });
};
