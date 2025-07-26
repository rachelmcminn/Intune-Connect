import React, { useEffect, useState } from 'react';
import { invoke } from "@forge/bridge";
import { styles } from "./styles.css";

import SectionMessage from '@atlaskit/section-message';
import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
import Toggle from '@atlaskit/toggle';
import Form, { 
    Label, 
    FormFooter,
    Field,
	FormSection,
} from '@atlaskit/form';
import Select from '@atlaskit/select';
import Button from '@atlaskit/button/new';
import { Stack } from '@atlaskit/primitives';
import Link from '@atlaskit/link';

import { IntervalSelect } from './constants'
import TabTwoForm from './Tab2Auth';
import TabThreeComponent from './Tab3';
import TabFourComponent from './Tab4';
import TabFiveComponent from './Tab5';


function App() {
    const [loading, setLoading] = useState(null);
    const [enableImportsToggle, setEnableImportsToggle] = useState(false);
    const [selectedInterval, setSelectedInterval] = useState(null);
    const [isLicensed, setIsLicensed] = useState(false);

    useEffect(() => {
        const checkLicense = async () => {
          const environment = await invoke("getEnvironment");
          if (environment === "DEVELOPMENT" || environment === "STAGING") {
            console.log(`Environment is ${environment}, skipping license check`);
            setIsLicensed(true);
            setLoading(false);
            return;
          }
      
          const licensed = await invoke("getLicenseStatus");
          setIsLicensed(licensed);
          setLoading(false);

      
          if (!licensed) {
            console.log("App is not licensed");
          } else {
            console.log("App is licensed");
          }
        };
      
        checkLicense();
      }, []);
      

    // Tab 1 Functions (Imports)
    useEffect(() => {
        invoke('getImportStatus')
            .then((status) => setEnableImportsToggle(status || false))
            .catch(() => setEnableImportsToggle(false));
    }, []);

    useEffect(() => {
        invoke('getImportInterval')
            .then((interval) => {
                const foundInterval = IntervalSelect.find(opt => opt.value === interval);
                setSelectedInterval(foundInterval || null);
            })
            .catch(() => setSelectedInterval(null));
    }, []);
    
    const toggleImportStatus = () => {
        setEnableImportsToggle((prevState) => !prevState);
    };

    const submitIntervalData = () => {
        const formPayload = {
            isEnabled: enableImportsToggle,
            interval: selectedInterval,
        }
        invoke('setImportSettings', formPayload);
    }

    if (loading) {
        return <div>Loading...</div>; // or a spinner component
      }
    
    if (!isLicensed) {
        return <div>This app is not licensed. Please contact support.</div>;
    }

    return (
        <div>
            {/* TODO add license check + individual data load checks */}
            <Tabs onChange={(index) => console.log('Selected Tab', index + 1)} id="default">
			<TabList>
				<Tab>Overview</Tab>
				<Tab>Intune Settings</Tab>
				<Tab>Test Import</Tab>
                <Tab>JSM Settings</Tab>
                <Tab>Schema</Tab>
			</TabList>

            {/* Overview Tab */}
			<TabPanel>
                <div className='panel-area'>
                    <SectionMessage title="Intune Connect" appearance="information">
                        <p>
                            With Intune Connect, effortlessly import your assets from Intune
                            into Jira Service Management, empowering your IT teams to track
                            and manage assets in a centralized system.
                        </p>
                    </SectionMessage>
    
                <div className="formDiv">
                <Form
                onSubmit={(data) => {
                    submitIntervalData(data);
                }}>
                {({ formProps }) => (
                    <form {...formProps}>
                    <FormSection>
                    <h3>Import Status</h3>
                    <div className='flex-col-8'>
                        <p htmlFor="toggle-import-status">Enable import</p>
                        <Toggle 
                            id="toggle-import-status" 
                            label="enable-import" 
                            name="enabled"
                            isChecked={enableImportsToggle} 
                            onChange={toggleImportStatus}>
                        </Toggle>
                    </div>

                    <h4 className='margin-t-s'>Interval</h4>
                    <p>Select the desired import interval (daily is recommended).</p>
                    <Label htmlFor="interval-select" className="label">Import Interval</Label>
                    <Select
                        inputId="interval-select"
                        options={IntervalSelect}
                        placeholder="Choose an import interval"
                        name="interval"
                        value={selectedInterval}
                        onChange={(selected) => setSelectedInterval(selected)}
                        isRequired
                />
                    </FormSection>
                    {/* TODO add saved validation messaging */}
                    <FormFooter align='start'>
                        <Button
                        appearance="primary"
                        id="save-interval-button"
                        type="submit"
                        >
                        Save Settings
                        </Button>
                    </FormFooter>
                    </form>
                )}
                </Form>
                </div>
            </div>   
			</TabPanel>

            {/* Intune Settings Tab */}
			<TabPanel>
                <Stack>
                <div className='panel-area'>
                    <SectionMessage title="Intune Settings" appearance="information">
                    <p>
                        Azure App Registration enables seamless integration with
                        Microsoft Intune, allowing for secure and controlled access to
                        Intune APIs and resources.
                    </p>
                    </SectionMessage>
                </div>
                <TabTwoForm />
                </Stack>

			</TabPanel>

            {/* *********************** */}
            {/* Test Import Tab */}
			<TabPanel>
                <Stack>
                 <div className='panel-area margin-b-s'>
                    <SectionMessage title="Preview Import" appearance="information">
                    <p>
                        Perform a manual preview import from Microsoft Intune to verify
                        connectivity to your Intune instance, ensuring seamless
                        integration and reliable asset management within your system.
                        The preview will only show a few attributes.
                    </p>
                    </SectionMessage>
                </div>	
                <TabThreeComponent />
                </Stack>		
            </TabPanel>

            {/* JSM Settings Tab */}
            <TabPanel>
                <Stack space="space.200">
                <div className='panel-area'>
                    <SectionMessage title="Container Token" appearance="information">
                    <p>
                        A schema import token is required for import, learn&nbsp;
                        <Link href="https://support.atlassian.com/jira-service-management-cloud/docs/generate-a-token-for-importing/" target="_blank">
                        how to generate a token here</Link>.
                    </p>
                    </SectionMessage>
                </div>
                <TabFourComponent/>
                </Stack>
            </TabPanel>
            
            {/* Schema Tab */}
            <TabPanel>
                <Stack>
                <div className='panel-area'>
                    <SectionMessage title="Assets Schema" appearance="warning">
                    <p>
                        Generating a schema will modify your instance, making it
                        essential to proceed with care as this action can have an impact
                        on your existing configurations and data. Ensure thorough
                        testing and backup measures are in place before initiating the
                        schema generation process.
                    </p>
                    </SectionMessage>
                </div>
                <TabFiveComponent />
           </Stack>
            </TabPanel>
		</Tabs>

            
        </div>
    );
}

export default App;
