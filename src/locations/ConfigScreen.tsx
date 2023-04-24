import { useCallback, useState, useEffect } from "react";
import { AppExtensionSDK } from "@contentful/app-sdk";
import {
  Heading,
  Form,
  Paragraph,
  Flex,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Textarea,
  FormLabel,
  TextInput,
  Box,
  FormControl,
} from "@contentful/f36-components";
import { css } from "emotion";
import { /* useCMA, */ useSDK } from "@contentful/react-apps-toolkit";
import { useForm } from "react-hook-form";
import { WarningIcon } from "@contentful/f36-icons";

export interface AppInstallationParameters {}

const ConfigScreen = () => {
  const [parameters, setParameters] = useState<AppInstallationParameters>({});
  const sdk = useSDK<AppExtensionSDK>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    const { formName, formSchema }: any = data;
    console.log("formName", {
      ...parameters,
      [formName]: {
        schema: formSchema,
      },
    });
    setParameters({
      ...parameters,
      [formName]: {
        schema: formSchema,
      },
    });
  };
  /*
       To use the cma, inject it as follows.
       If it is not needed, you can remove the next line.
    */
  // const cma = useCMA();

  const onConfigure = useCallback(async () => {
    // This method will be called when a user clicks on "Install"
    // or "Save" in the configuration screen.
    // for more details see https://www.contentful.com/developers/docs/extensibility/ui-extensions/sdk-reference/#register-an-app-configuration-hook

    // Get current the state of EditorInterface and other entities
    // related to this app installation
    const currentState = await sdk.app.getCurrentState();

    return {
      // Parameters to be persisted as the app configuration.
      parameters,
      // In case you don't want to submit any update to app
      // locations, you can just pass the currentState as is
      targetState: currentState,
    };
  }, [parameters, sdk]);

  const deleteForm = (formName: string) => {
    const { [formName]: _, ...rest }: any = parameters;
    setParameters(rest);
  };
  useEffect(() => {
    // `onConfigure` allows to configure a callback to be
    // invoked when a user attempts to install the app or update
    // its configuration.
    sdk.app.onConfigure(() => onConfigure());
  }, [sdk, onConfigure, errors]);

  useEffect(() => {
    (async () => {
      // Get current parameters of the app.
      // If the app is not installed yet, `parameters` will be `null`.
      const currentParameters: AppInstallationParameters | null =
        await sdk.app.getParameters();

      if (currentParameters) {
        setParameters(currentParameters);
      }

      // Once preparation has finished, call `setReady` to hide
      // the loading screen and present the app to a user.
      sdk.app.setReady();
    })();
  }, [sdk]);

  return (
    <Flex
      flexDirection="column"
      className={css({ margin: "80px", maxWidth: "800px" })}
    >
      <Box>
        <Heading
          className={css({
            fontSize: "2rem",
            lineHeight: "2.5rem",
          })}
        >
          Contentful Schema JSON Form
        </Heading>
        <Paragraph
          className={css({
            fontSize: "1.5rem",
            lineHeight: "1.5",
          })}
        >
          This app will allow you to create dynamic forms based on a JSON Schema
          for your JSON based fields.
          <br />
          The JSON Schemas you create will be stored in the app's configuration.
          For more information on how to create a JSON Schema, see{" "}
          <a href="https://github.com/rjsf-team/react-jsonschema-form">
            React JSON Schema Form
          </a>
          .
        </Paragraph>
        <br />
        <br />
        <Heading
          className={css({
            fontSize: "2rem",
            lineHeight: "2.5rem",
          })}
        >
          Saved Forms:
        </Heading>
        <Paragraph
          className={css({
            fontSize: "1.5rem",
            lineHeight: "1.5",
          })}
        >
          Here are the forms you have saved. You can edit or delete them.
        </Paragraph>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                className={css({
                  fontSize: "1.5rem",
                  lineHeight: "1.5",
                })}
              >
                Form Name
              </TableCell>
              <TableCell
                className={css({
                  fontSize: "1.5rem",
                  lineHeight: "1.5",
                })}
              >
                Actions
              </TableCell>
              <TableCell
                className={css({
                  fontSize: "1.5rem",
                  lineHeight: "1.5",
                })}
              >
                Form Schema
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(parameters).map((formName) => {
              return (
                <TableRow key={formName}>
                  <TableCell>
                    <Paragraph
                      className={css({
                        fontSize: "1.5rem",
                        lineHeight: "1.5",
                      })}
                    >
                      {formName}
                    </Paragraph>
                  </TableCell>
                  <TableCell>
                    <Button
                      className={css({
                        fontSize: "1.5rem",
                        lineHeight: "1.5",
                      })}
                      onClick={() => {
                        deleteForm(formName);
                      }}
                      variant="negative"
                    >
                      Delete
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Textarea
                      className={css({
                        fontSize: "1.5rem",
                        lineHeight: "1.5",
                      })}
                      value={JSON.stringify(
                        (parameters as any)[formName].schema,
                        null,
                        2
                      )}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <br />
        <br />
        <Heading
          className={css({
            fontSize: "2rem",
            lineHeight: "2.5rem",
          })}
        >
          Add a New Form
        </Heading>

        <Paragraph
          className={css({
            fontSize: "1.5rem",
            lineHeight: "1.5",
          })}
        >
          To add a new form, enter a name for the form and the JSON Schema for
          the form.
        </Paragraph>
        <br />
        <br />
        <span
          className={css({
            fontSize: "1.5rem",
            lineHeight: "1.5",
          })}
        >
          <WarningIcon
            variant="warning"
            className={css({ marginRight: "8px" })}
          />
          <strong>Remember.</strong> &nbsp;After Modify the form, you must click{" "}
          &nbsp;
          <Button
            variant="primary"
            className={css({
              fontSize: "1.5rem",
              lineHeight: "1.5",
            })}
          >
            Save
          </Button> &nbsp;
          to save the configuration.
        </span>
        <br />
        <br />
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormLabel
            className={css({
              fontSize: "1.5rem",
              lineHeight: "1.5",
            })}
            htmlFor="formName"
          >
            Form Name
          </FormLabel>
          <TextInput
            className={css({
              fontSize: "1.5rem",
              lineHeight: "1.5",
            })}
            id="formName"
            {...register("formName", {
              required: "Form Name is required",
              validate: (value) => {
                if (value.trim() === "") {
                  return "Form Name is required";
                }
                if (value.length > 30) {
                  return "Form Name must be less than 30 characters";
                }
                // if have spaces
                if (value.match(/\s/)) {
                  return "Form Name cannot contain spaces";
                }
                if (value in parameters) {
                  return "Form Name already exists";
                }
              },
            })}
            name="formName"
          />
          {
            // if there is an error for the formName field, show it
            errors.formName && (
              <FormControl.ValidationMessage
                className={css({
                  fontSize: "1.5rem",
                  lineHeight: "1.5",
                })}
              >
                {(errors.formName as any).message}
              </FormControl.ValidationMessage>
            )
          }
          <FormLabel
            htmlFor="formSchema"
            className={css({
              fontSize: "1.5rem",
              lineHeight: "1.5",
            })}
          >
            Form Schema
          </FormLabel>
          <Textarea
            id="formSchema"
            {...register("formSchema", {
              required: "Form Schema is required",
              validate: async (value) => {
                if (value.trim() === "") {
                  return "Form Schema is required";
                }
                try {
                  JSON.parse(value);
                } catch (e) {
                  return "Form Schema must be valid JSON";
                }
              },
            })}
            name="formSchema"
            className={css({
              fontSize: "1.5rem",
              lineHeight: "1.5",
            })}
          />
          {
            // if there is an error for the formSchema field, show it
            errors.formSchema && (
              <FormControl.ValidationMessage
                className={css({
                  fontSize: "1.5rem",
                  lineHeight: "1.5",
                })}
              >
                {(errors.formSchema as any).message}
              </FormControl.ValidationMessage>
            )
          }

          <Button
            type="submit"
            className={css({
              fontSize: "1.5rem",
              lineHeight: "1.5",
            })}
          >
            Create new Form
          </Button>
        </Form>
      </Box>
    </Flex>
  );
};

export default ConfigScreen;
