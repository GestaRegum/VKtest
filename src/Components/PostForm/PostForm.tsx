import React, { useState } from "react";
import { Formik, Form } from "formik";
import { Button, Input, Space, message, Card, Row, Col } from "antd";
import { PlusOutlined, DeleteOutlined, SaveOutlined } from "@ant-design/icons";
import { useCreatePost } from "../../hooks/useCreatePost";
import {
  getInitialValues,
  getValidationSchema,
} from "../../utils/postFormUtils";
import styles from "./PostForm.module.css";

export const PostForm = () => {
  const [extraFields, setExtraFields] = useState<string[]>([]);
  const [fieldCounter, setFieldCounter] = useState(1);
  const mutation = useCreatePost();

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
        initialValues={getInitialValues(extraFields)}
        enableReinitialize
        validationSchema={getValidationSchema(extraFields)}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          const postData = {
            title: values.title,
            views: Number(values.views),
            author: values.author,
            category: values.category,
            status: values.status,
            ...extraFields.reduce((acc, field) => {
              if (values[field]) acc[field] = values[field];
              return acc;
            }, {} as Record<string, string>),
          };

          mutation.mutate(postData, {
            onSettled: () => {
              setSubmitting(false);
              resetForm({ values: getInitialValues(extraFields) });
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
