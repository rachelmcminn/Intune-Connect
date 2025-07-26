export const StoragePrefix = "intune-connect";
export const TokenURLEndpoint = "https://login.microsoftonline.com";
export const GraphURLEndpoint = "https://graph.microsoft.com";
export const GraphURLScope = "https%3A%2F%2Fgraph.microsoft.com%2F.default";
export const ContainerTokenURL =
  "https://api.atlassian.com/jsm/assets/v1/imports/info";

  export const keys = {
    appEnableImport: `${StoragePrefix}-enable-import`,
    appImportInterval: `${StoragePrefix}-import-interval`,
    jsmContainerToken: `${StoragePrefix}-container-token`,
    jsmStatusUrl: `${StoragePrefix}-status-url`,
    jsmStartUrl: `${StoragePrefix}-start-url`,
    jsmMappingUrl: `${StoragePrefix}-mapping-url`,
    jsmConfigured: `${StoragePrefix}-jsm-configured`,
    jsmSchemaConfigured: `${StoragePrefix}-schema-configured`,
    intuneClient: `${StoragePrefix}-graph-client`,
    intuneTenant: `${StoragePrefix}-graph-tenant`,
    intuneSecret: `${StoragePrefix}-graph-secret`,
    intuneConfigured: `${StoragePrefix}-graph-configured`,
  };