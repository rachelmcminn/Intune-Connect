import React, { useEffect, useState } from 'react';
import { invoke } from "@forge/bridge";
import { styles } from "./styles.css";

import { Checkbox } from '@atlaskit/checkbox';
import Button from '@atlaskit/button/new';
import DynamicTable from '@atlaskit/dynamic-table';
import { Stack } from '@atlaskit/primitives';


function TabThreeComponent() {
    const [isChecked, setIsChecked] = useState(false);
    const [devices, setDevices] = useState([]);
    const [testFormState, setTestFormState] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const checkboxChanged = () => {
        setIsChecked(!isChecked);
    };

    const intuneTestSubmit = async () => {
    console.log('running');
      setTestFormState("Loading preview import...");
      setIsLoading(true);
      let statusMessage;
      const secret = await invoke("getIntuneGraphSecret");
      const tenant = await invoke("getIntuneGraphTenant");
      const client = await invoke("getIntuneGraphClient");
      
      if (tenant && client && secret) {  
        const authParams = {
            tenant: tenant,
            client: client,
            secret: secret
        };
        const authToken = await invoke("getAADToken", authParams);
        console.log("Auth Token:", authToken);

        const token = authToken.response.access_token;
        const tokenStatus = authToken.status;
        const tokenStatusMessage = authToken.status_message;
  
        if (tokenStatus === 200) {
            const tokenResults = {
                token: token,
                tokenStatus:tokenStatus,
            }
            const intuneDevices = await invoke("getTestIntuneDevices", tokenResults);
            if (intuneDevices.status === 200) {
                setDevices(intuneDevices.results);
    
                statusMessage = `✅ Success - ${intuneDevices.results.length} Assets Imported for Preview`;
                setTestFormState(true);
          } else {
            setDevices([]);
            statusMessage = `⚠️ Error - ${intuneDevices.status_message}`;
          }
          console.log(tokenStatusMessage);
        }
        setTestFormState(statusMessage);
      } else {
        setTestFormState("⚠️ Please configure your Intune Settings tab.");
      }
      setIsLoading(false);
    };

    const head = {
        cells: [
          { key: "deviceName", content: "Device Name", isSortable: false },
          { key: "userPrincipalName", content: "Primary User", isSortable: false },
          { key: "manufacturer", content: "Manufacturer", isSortable: false },
        ],
      };
    
      return (
        <div>
            <div className='margin-b-b margin-t-s'>
                <p>Click on the button below to invoke the preview import.</p>
                {/* <Checkbox isChecked={isChecked} label="Preview Import" name="checkbox" onChange={checkboxChanged}  /> */}
            </div>
            <Button isLoading={isLoading} onClick={intuneTestSubmit} appearance="primary" type="button" className="margin-b-b margin-t-b">
                Test Import
            </Button>
    
            {testFormState && <p className='margin-b-s'>{testFormState}</p>}
    
            {devices.length > 0 && (
                <DynamicTable
                head={head}
                rows={devices.map((device, index) => ({
                    key: `row-${index}-${device.id}`,
                    cells: [
                    { key: device.id, content: device.deviceName },
                    { key: device.userPrincipalName, content: device.userPrincipalName },
                    { key: device.manufacturer, content: device.manufacturer },
                    ],
                }))}
                rowsPerPage={12}
                defaultPage={1}
                className="margin-b-b"
                />
            )}
        </div>
      );
}

export default TabThreeComponent;
