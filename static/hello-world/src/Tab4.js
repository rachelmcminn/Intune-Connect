import React, { useEffect, useState } from "react";
import { invoke } from "@forge/bridge";
import Button from "@atlaskit/button/new";
import Textfield from "@atlaskit/textfield";
import Form, { Label } from '@atlaskit/form';

function TabFourComponent() {
  const [intuneGraphConfig, setIntuneGraphConfig] = useState(false);
  const [jsmToken, setJsmToken] = useState("");
  const [jsmGetStatusURL, setJsmGetStatusURL] = useState("");
  const [jsmStartURL, setJsmStartURL] = useState("");
  const [jsmMappingURL, setJsmMappingURL] = useState("");
  const [jsmFormState, setJsmFormState] = useState("");

  useEffect(() => {
    invoke("getIntuneGraphConfig")
      .then((status) => setIntuneGraphConfig(status || false))
      .catch(() => setIntuneGraphConfig(false));
  }, []);

  const handleSubmit = async () => {
    if (!jsmToken.trim()) {
      setJsmFormState("❌ Please enter a token.");
      return;
    }

    await invoke("setJsmContainerToken", { token: jsmToken });
    const tempToken = await invoke("getJsmContainerToken");
    const importLinks = await invoke("validateJSMToken", { token: tempToken });

    if (importLinks.status === 200) {
       await invoke("setJsmGetStatusURL", { url: importLinks.links.getStatus });
       await invoke("setJsmStartURL", { url: importLinks.links.start });
       await invoke("setJsmMappingUrl", { url: importLinks.links.mapping });

       const tempStatusURL = await invoke("getJsmGetStatusURL");
       const tempStartURL = await invoke("getJsmGetStartURL");
       const tempMappingURL = await invoke("getJsmGetMappingURL");

      setJsmGetStatusURL(tempStatusURL);
      setJsmStartURL(tempStartURL);
      setJsmMappingURL(tempMappingURL);

      await invoke("setJsmConfigured", { configured: true });
      setJsmFormState("✅ Token Configuration Successful");
      
    } else {
      setJsmFormState(`❌ Token Configuration Error - ${importLinks.msg}`);
    }
  };

  return (
    <div>
        <div className="margin-b-s">
        {!intuneGraphConfig ? <p>⚠️ Configuration Required</p> : <p>✅ Successfully Configured</p>}
        </div>
      

      <Label htmlFor="jsmtoken" className="label">Client Secret (will not display after save)</Label>
      <Textfield 
        id="jsmtoken" 
        value={jsmToken} 
        onChange={({ target }) => setJsmToken(target.value)}
      />

      <div className="url-items">
        <p className="label-h6">Get Status URL</p>
        <p className="value-url">{jsmGetStatusURL || "Status URL Required"}</p>

        <p className="label-h6">Start URL</p>
        <p className="value-url">{jsmStartURL || "Start URL Required"}</p>

        <p className="label-h6">Mapping URL</p>
        <p className="value-url">{jsmMappingURL || "Mapping URL Required"}</p>
      </div>

    <div className="margin-t-b">
    <Button appearance="primary" onClick={handleSubmit} >
        Save
      </Button>
    </div>
     
      {/* TODO clear button */}

      {jsmFormState && <p>{jsmFormState}</p>}
    </div>
  );
}

export default TabFourComponent;
