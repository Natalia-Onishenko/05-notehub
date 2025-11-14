import type { FC } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../services/noteService";
import type { NoteTag } from "../../types/note";
import css from "./NoteForm.module.css";

interface NoteFormProps {
  onCancel: () => void;
}

interface FormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

const NoteForm: FC<NoteFormProps> = ({ onCancel }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: FormValues) => createNote(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onCancel();
    },
  });

  const validationSchema = Yup.object({
    title: Yup.string().min(3).max(50).required(),
    content: Yup.string().max(500),
    tag: Yup.mixed<NoteTag>()
      .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
      .required(),
  });

  return (
    <Formik<FormValues>
      initialValues={{ title: "", content: "", tag: "Todo" }}
      validationSchema={validationSchema}
      onSubmit={(values) => mutation.mutate(values)}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" className={css.input} />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              as="textarea"
              id="content"
              name="content"
              rows={8}
              className={css.textarea}
            />
            <ErrorMessage
              name="content"
              component="span"
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onCancel}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className={css.submitButton}
            >
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NoteForm;