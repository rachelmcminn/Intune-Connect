import React, { useEffect, useState } from "react";
import { invoke } from "@forge/bridge";
import Button from "@atlaskit/button/new";
import Textfield from "@atlaskit/textfield";
import Form, { Label, FormFooter } from '@atlaskit/form';
import { Checkbox } from '@atlaskit/checkbox';


function TabFiveComponent() {
    const [schemaFormState, setSchemaFormState] = useState(null);
    const [isChecked, setIsChecked] = useState(false);
    const [schemaSettingsConfig, setSchemaSettingsConfig] = useState(null);
    const [jsmMappingURL, setjsmMappingURL] = useState(null);
    const [jsmSettingsConfig, setJsmSettingsConfig] = useState(null);

    useEffect(() => {
        invoke("getJsmMappingUrl")
        .then((mappingURL) => setjsmMappingURL(mappingURL || "Valid Token Required"))
    }, []);

    useEffect(() => {
        invoke("getJsmSchemaConfigured")
        .then((config) => setJsmSettingsConfig(config || false))
    }, []);


const schemaSubmit = async (formData) => {
    setSchemaFormState("Loading schema generation...");
    let statusMessage;

    const mappingURL = await invoke('getJsmMappingURL');
    const secret = await invoke('getJsmContainerToken');

    if (jsmSettingsConfig) {
    const response = await invoke("createSchemaInAssets", {
        mappingURL: mappingURL,
        secret: secret,
      });
      const status = response.status;

      if (status == 204) {
        statusMessage = "✅ Schema Generation Successful";
        await invoke("setJsmSchemaConfigured", true);
        const tempSchemaConfig = await invoke("getJsmSchemaConfigured", false);
        setSchemaSettingsConfig(tempSchemaConfig);

      } else if (status == 409) {
        if (response.statusText != "Conflict") {
            await invoke("setJsmSchemaConfigured", false);
            statusMessage = `❌ Schema Generation Error - Please see the log for more information`;
        } else {
            await invoke("setJsmSchemaConfigured", true);
            setSchemaSettingsConfig(true);
            statusMessage = `⚠️ Schema Generation Conflict - schema already exists`;
        }
      } else {
        await invoke("setJsmSchemaConfigured", false);
        const tempSchemaConfig = await invoke("getJsmSchemaConfigured", false);
        setSchemaSettingsConfig(tempSchemaConfig);

        statusMessage = `❌ Schema Generation Error - Here is the full response: ${response}`;
      }

      setSchemaFormState(statusMessage);
    }
  };

  const checkboxChanged = () => {
    setIsChecked(!isChecked);
    };

return(
    <div>
    {!schemaSettingsConfig && <p>⚠️ Configuration Required</p>}
       {schemaSettingsConfig && <p>✅ Successfully Configured</p>}
       
         <Checkbox
           value="accept"
           label="I understand and would like to proceed"
           isRequired="true"
           onChange={checkboxChanged}
         />
           <Button appearance="warning" type="submit" onSubmit={schemaSubmit} isDisabled={!isChecked} >
             Create Object Schema
           </Button>
         {schemaFormState && <p>{schemaFormState}</p>}
           
    </div>


)};

export default TabFiveComponent;