import React, { useEffect, useState } from "react";
import { Button, Heading, Paragraph } from "@contentful/f36-components";
import { FieldExtensionSDK } from "@contentful/app-sdk";
import { /* useCMA, */ useSDK } from "@contentful/react-apps-toolkit";
import { css } from "emotion";
import Form from "@rjsf/core";
import { WarningIcon } from "@contentful/f36-icons";
import "bootstrap/dist/css/bootstrap.min.css";
// @ts-ignore
import validator from "@rjsf/validator-ajv8";

const FormGroupClass = css`

  * {
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial,
      sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;
  }
  i {
    font-family: "Glyphicons Halflings";
  }

  .rjsf {
    box-sizing: content-box;
    max-width: 680px;
  }
  .form-group {
    padding: 6px;
    border-radius: 4px;
    border: solid 1px #e3e9ed;
    margin-bottom: 1em;

    &:nth-child(1) {
      background-color: #f7f9fa;
    }
  }

  .panel-danger.errors {
    margin-bottom: 2em;
    .panel-heading {
      margin-bottom: 1em;
    }
  }
`;

const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>();
  const { field, notifier, window } = sdk;
  const [toggle, setToggle] = useState(false);
  const SchemaId = sdk.parameters?.instance?.schemas;
  const schemaData = sdk.parameters?.installation?.[SchemaId].schema;
  const { schema, UISchema, validate, initialData, name } =
    JSON.parse(schemaData);
  const [formData, setFormData] = useState(field.getValue() || initialData);
  const [previousFormData, setPreviousFormData] = useState(null);

  const validateAndSet = () => {
    try {
    } catch (error: any) {
      console.log(error);

      if (error) {
        field.setInvalid(true);
        notifier.error(error.message);
      }
    }
  };

  useEffect(() => {
    const unsuscribe = field.onValueChanged(validateAndSet);
    return () => unsuscribe();
  });

  useEffect(() => {
    window.startAutoResizer();
    setPreviousFormData(formData);
  }, []);
  /*
     To use the cma, inject it as follows.
     If it is not needed, you can remove the next line.
  */
  // const cma = useCMA();
  // If you only want to extend Contentful's default editing experience
  // reuse Contentful's editor components
  // -> https://www.contentful.com/developers/docs/extensibility/field-editors/
  return (
    <div className={FormGroupClass}>
      <Heading as="h2">{SchemaId} Schema</Heading>
      <Paragraph>
        This is a custom field extension for the {SchemaId} form to allow non
        tech users to create and edit JSON fields in Contentful. Below is a
        preview of the form data. You can edit the form data and save it to take
        a look.
      </Paragraph>
       <span>
          <WarningIcon
            variant="warning"
            className={css({ marginRight: "8px" })}
          />
          <strong>Remember.</strong> &nbsp; After add or delete a form, you must
          click "Save" to save the configuration.
        </span>
      <div>
        {toggle ? (
          <>
            <br />
            <h3>Last saved valid data</h3>
            <pre>{JSON.stringify(previousFormData, null, 2)}</pre>
            <br />
            <br />
            <h3>Current form data</h3>
            <pre>{JSON.stringify(formData, null, 2)}</pre>
            <Button
              size="small"
              variant="negative"
              onClick={() => setToggle(false)}
            >
              hide data
            </Button>
            <br /> <br />
          </>
        ) : (
          <>
            <br />
            <Button
              size="small"
              variant="positive"
              onClick={() => setToggle(true)}
            >
              Show preview json data
            </Button>
            <br /> <br />
          </>
        )}
      </div>
      <Form
        validator={validator}
        liveValidate
        {...{
          schema: schema,
          uiSchema: UISchema,
          validate,
        }}
        formData={formData}
        onChange={(e) => setFormData(e.formData)}
        onSubmit={(e) => {
          if (
            e.formData &&
            e.formData !== initialData &&
            e.formData !== field.getValue()
          ) {
            field.setValue(e.formData);
            setPreviousFormData(e.formData);
          }
        }}
        onError={(e) => {
          field.setValue(previousFormData);
        }}
      />
    </div>
  );
};

export default Field;
