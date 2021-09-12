import { useForm, FormProvider } from 'react-hook-form';
import { i18n } from 'src/i18n';
import React, { useState } from 'react';
import InputFormItem from 'src/view/shared/form/items/InputFormItem';
import SelectFormItem from 'src/view/shared/form/items/SelectFormItem';
import TagsFormItem from 'src/view/shared/form/items/TagsFormItem';
import FormWrapper from 'src/view/shared/styles/FormWrapper';
import ButtonIcon from 'src/view/shared/ButtonIcon';
import * as yup from 'yup';
import yupFormSchemas from 'src/modules/shared/yup/yupFormSchemas';
import userEnumerators from 'src/modules/user/userEnumerators';
import { yupResolver } from '@hookform/resolvers';

const singleSchema = yup.object().shape({
  email: yupFormSchemas.email(i18n('user.fields.email')),
  roles: yupFormSchemas.stringArray(
    i18n('user.fields.roles'),
    { required: true, min: 1 },
  ),
});

const multipleSchema = yup.object().shape({
  emails: yup
    .array()
    .label(i18n('user.fields.emails'))
    .of(
      yup
        .string()
        .transform((cv, ov) => {
          return ov === null ? undefined : cv;
        })

        .email(i18n('user.validations.email'))
        .label(i18n('user.fields.email'))
        .max(255)
        .required(),
    )
    .required(),
  roles: yupFormSchemas.stringArray(
    i18n('user.fields.roles'),
    { required: true, min: 1 },
  ),
});

function UserNewForm(props) {
  const { single, saveLoading } = props;

  const schema = props.single
    ? singleSchema
    : multipleSchema;

  const [initialValues] = useState(() => ({
    emails: [],
    email: '',
    roles: [],
  }));

  const form = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
    defaultValues: initialValues,
  });

  const onSubmit = (values) => {
    const { ...data } = values;

    if (data.email) {
      data.emails = [data.email];
      delete data.email;
    }

    props.onSubmit(null, data);
  };

  const onReset = () => {
    Object.keys(initialValues).forEach((key) => {
      form.setValue(key, initialValues[key]);
    });
  };

  return (
    <FormWrapper>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-lg-7 col-md-8 col-12">
              {single ? (
                <InputFormItem
                  name="email"
                  label={i18n('user.fields.email')}
                  required={true}
                  autoFocus
                />
              ) : (
                <TagsFormItem
                  name="emails"
                  label={i18n('user.fields.emails')}
                  notFoundContent={i18n(
                    'user.new.emailsHint',
                  )}
                  required={true}
                />
              )}
            </div>
            <div className="col-lg-7 col-md-8 col-12">
              <SelectFormItem
                name="roles"
                label={i18n('user.fields.roles')}
                required={true}
                options={userEnumerators.roles.map(
                  (value) => ({
                    value,
                    label: i18n(`roles.${value}.label`),
                  }),
                )}
                mode="multiple"
              />
            </div>
          </div>

          <div className="form-buttons">
            <button
              className="btn btn-primary"
              disabled={saveLoading}
              type="button"
              onClick={form.handleSubmit(onSubmit)}
            >
              <ButtonIcon
                loading={saveLoading}
                iconClass="far fa-save"
              />{' '}
              {i18n('common.save')}
            </button>

            <button
              disabled={saveLoading}
              onClick={onReset}
              className="btn btn-light"
              type="button"
            >
              <i className="fas fa-undo"></i>{' '}
              {i18n('common.reset')}
            </button>

            {props.onCancel ? (
              <button
                disabled={saveLoading}
                onClick={() => props.onCancel()}
                className="btn btn-light"
                type="button"
              >
                <i className="fas fa-times"></i>{' '}
                {i18n('common.cancel')}
              </button>
            ) : null}
          </div>
        </form>
      </FormProvider>
    </FormWrapper>
  );
}

export default UserNewForm;
