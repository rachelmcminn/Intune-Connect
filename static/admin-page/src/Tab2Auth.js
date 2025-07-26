import React, { useEffect, useState } from 'react';
import { invoke } from "@forge/bridge";
import { styles } from "./styles.css";
import Form, { Label, FormFooter, Field, FormHeader, FormSection, HelperMessage, RequiredAsterisk, ValidMessage, ErrorMessage } from '@atlaskit/form';
import Button from '@atlaskit/button/new';
import TextField from '@atlaskit/textfield';

function TabTwoForm() {
    const [intuneSettingsConfig, setIntuneSettingsConfig] = useState(null);
    const [intuneFormStatusMsg, setIntuneFormStatusMsg] = useState(null);
    const [loading, setLoading] = useState(true);

    const [formState, setFormState] = useState({
        client: "",
        tenant: "",
        secret: "",
        state: false,
      });
    
      useEffect(() => {
        const fetchData = async () => {
          try {
            const [client, tenant, secret, config] = await Promise.all([
              invoke("getIntuneGraphClient"),
              invoke("getIntuneGraphTenant"),
              invoke("getIntuneGraphSecret"),
              invoke("getIntuneGraphConfig"),
            ]);
            setIntuneSettingsConfig(config);
    
            setFormState({
              client: client || "",
              tenant: tenant || "",
              secret: secret || "",
              state: config || false,
            });
    
            setLoading(false);
          } catch (error) {
            console.error("error fetching data:", error);
            setLoading(false);
          }
        };
    
        fetchData();
      }, []);
    
      const intuneAuthSubmit = async (formData) => {
        let msg = "❌ Error - Missing required fields"; 
        console.log('formdata: ',formData);
    
        if (formData.client && formData.tenant && formData.secret) {
          const authToken = await invoke("getAADToken", formData);
    
        //   here
        console.log('authToken ',authToken);
        const tokenStatus = authToken.status;
        const tokenStatusMessage = authToken.status_message;
    
          if (tokenStatus === 200) {
            const storageInfo = await invoke("setIntuneSettings", formData);
            console.log('storageInfo', storageInfo);
            setIntuneSettingsConfig(storageInfo.configured);
    
            setFormState({
              client: storageInfo.client,
              tenant: storageInfo.tenant,
              secret: storageInfo.secret,
              state: storageInfo.configured,
            });
          }

          msg = `${
            tokenStatus === 200 ? `✅ Success!` : `❌ Error - ${tokenStatusMessage}`
          }`;
        }
    
        setIntuneFormStatusMsg(msg);
      };
    

    const clearIntuneSettings = async () => {
        let msg;
        try {
          await invoke("clearStorage");
    
          setFormState({
            client: "",
            tenant: "",
            secret: "",
            state: false,
          });
          setIntuneSettingsConfig(false);
          
        //   TODO investigate - console log said storage cleared but msg said auth requireds
          msg = undefined;
          console.log("Storage cleared");
        } catch (error) {
          console.error("error clearing storage: ", error);
          msg = "Unable to delete storage";
        }
    
        setIntuneFormStatusMsg(msg);
      };
    

    return (
        <div className='margin-t-s formDiv'>
            {!loading &&
                <div>
                    {!intuneSettingsConfig && <p>⚠️ Configuration Required</p>}
                    {intuneSettingsConfig && <p>✅ Successfully Configured</p>}
                </div>
            }
        <Form
          onSubmit={(data) => {
            console.log("formdata", data);
            intuneAuthSubmit(data);
          }}
        >
          {({ formProps }) => (
            <form {...formProps}>
              <FormSection>
                <Field
                  aria-required={true}
                  name="client"
                  label="Application (Client) Id"
                  defaultValue={formState.client}
                  isRequired
                >
                  {({ fieldProps }) => <TextField {...fieldProps} />}
                </Field>

                <Field
                  aria-required={true}
                  name="tenant"
                  label="Tenant ID"
                  defaultValue={formState.tenant}
                  isRequired
                >
                  {({ fieldProps }) => <TextField {...fieldProps} />}
                </Field>

                <Field
                  aria-required={true}
                  name="secret"
                  label="Client Secret (will not display after save)"
                  defaultValue={formState.secret}
                  isRequired
                >
                  {({ fieldProps }) => (
                    <TextField type="password" {...fieldProps} />
                  )}
                </Field>
              </FormSection>
              <FormFooter>
                <Button
                  appearance="subtle"
                  id="clear"
                  onClick={() => {
                    clearIntuneSettings();
                  }}
                >
                  Clear
                </Button>
                <Button
                  appearance="primary"
                  id="save-validate-button"
                  type="submit"
                >
                  Save & Validate
                </Button>
              </FormFooter>
            </form>
          )}
        </Form>
        <div className="msg-wrapper">
          {/* Nested if statement to avoid doubling up messages */}
          {intuneFormStatusMsg ? (
            <p>{intuneFormStatusMsg}</p>
          ) : formState.state ? (
            <p>✅ Successfully Authenticated</p>
          ) : (
            <p>⚠️ Authentication Required</p>
          )}
        </div>
      </div>

    );
}

export default TabTwoForm;
