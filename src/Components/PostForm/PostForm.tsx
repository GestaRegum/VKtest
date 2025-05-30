import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { API_URL } from "../../config";
import { Button, Input, Space, message, Card, Row, Col } from "antd";
import { PlusOutlined, DeleteOutlined, SaveOutlined } from "@ant-design/icons";
import { FormValues, PostInput } from "../types";
import styles from "./PostForm.module.css";

export const PostForm = () => {
  const queryClient = useQueryClient();
  const [extraFields, setExtraFields] = useState<string[]>([]);
  const [fieldCounter, setFieldCounter] = useState(1);

  const mutation = useMutation<void, unknown, PostInput>(
    (newPost) => axios.post(`${API_URL}/posts`, newPost),
    {
      onSuccess: () => {
        message.success("Пост успешно создан!");
        queryClient.invalidateQueries("posts");
        setExtraFields([]);
        setFieldCounter(1);
      },
      onError: (error: any) => {
        message.error(
          `Ошибка при создании поста: ${
            error.response?.data?.message || error.message
          }`
        );
      },
    }
  );

  const getInitialValues = (): FormValues => {
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
  const handleAddField = () => {
    const newField = `доп информация ${fieldCounter}`;
    setExtraFields([...extraFields, newField]);
    setFieldCounter(fieldCounter + 1);
  };

  const handleRemoveField = (field: string) => {
    setExtraFields(extraFields.filter((f) => f !== field));
  };

  return (
    <Card title="Создать новый пост" className={styles.card}>
      <Formik
        initialValues={getInitialValues()}
        enableReinitialize
        validationSchema={Yup.object({
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
        })}
        onSubmit={(values: FormValues, { setSubmitting, resetForm }) => {
          const postData: PostInput = {
            title: values.title,
            views: Number(values.views),
            author: values.author,
            category: values.category,
            status: values.status,
          };

          extraFields.forEach((field) => {
            if (values[field]) {
              postData[field] = values[field];
            }
          });

          mutation.mutate(postData, {
            onSettled: () => {
              setSubmitting(false);
              resetForm({ values: getInitialValues() });
            },
          });
        }}
      >
        {({
          isSubmitting,
          handleChange,
          handleBlur,
          values,
          errors,
          touched,
          submitForm,
        }) => (
          <Form className={styles.form}>
            <Row gutter={16}>
              <Col span={12}>
                <div>
                  <label>Заголовок</label>
                  <Input
                    name="title"
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </Col>
              <Col span={12}>
                <div>
                  <label>Просмотры</label>
                  <Input
                    name="views"
                    type="number"
                    value={values.views}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <div>
                  <label>Автор</label>
                  <Input
                    name="author"
                    value={values.author}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </Col>
              <Col span={12}>
                <div>
                  <label>Категория</label>
                  <Input
                    name="category"
                    value={values.category}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </Col>
            </Row>

            <div>
              <label>Статус</label>
              <Input
                name="status"
                value={values.status}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>

            {extraFields.map((field) => (
              <div key={field}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <label>{field}</label>
                  <Button
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveField(field)}
                  />
                </div>
                <Input
                  name={field}
                  value={values[field] || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  status={errors[field] && touched[field] ? "error" : ""}
                />
              </div>
            ))}

            <Space>
              <Button
                type="dashed"
                onClick={handleAddField}
                icon={<PlusOutlined />}
              >
                Добавить поле
              </Button>
              <Button
                type="primary"
                loading={isSubmitting}
                icon={<SaveOutlined />}
                onClick={() => {
                  if (
                    !values.title ||
                    !values.views ||
                    !values.author ||
                    !values.category ||
                    !values.status
                  ) {
                    message.error("Заполните все обязательные поля");
                    return;
                  }
                  submitForm();
                }}
              >
                Создать пост
              </Button>
            </Space>
          </Form>
        )}
      </Formik>
    </Card>
  );
};
