# Forge Intune Connect 

The Intune Connect app is a powerful integration tool designed to seamlessly connect Microsoft Intune and Jira Service Management CMDB. It imports Intune asset data, such as devices (current), applications (future), and configurations (future), into the Jira Service Management CMDB for streamlined asset management.

This was initially written using their UI Kit framework but I reworked and converted the entire project to Custom UI due to the future deprecation and addition of breaking changes to the UI Kit.
Written for [T4S Partners](https://t4spartners.com/intune-connect-for-jira-service-management/).

This project contains a Forge app written in Javascript that is displayed in a Jira admin page. 
See [developer.atlassian.com/platform/forge/](https://developer.atlassian.com/platform/forge) for documentation and tutorials explaining Forge.

## Requirements

See [Set up Forge](https://developer.atlassian.com/platform/forge/set-up-forge/) for instructions to get set up.

## Quick start
- Install top-level dependencies:
```
npm install
```

- Install dependencies (inside of the `static/admin-page` directory):
```
npm install
```

- Modify your app by editing the files in `static/admin-page/src/`.

- Build your app (inside of the `static/admin-page` directory):
```
npm run build
```

- Deploy your app by running:
```
forge deploy
```

- Install your app in an Atlassian site by running:
```
forge install
```

### Notes
- Use the `forge deploy` command when you want to persist code changes.
- Use the `forge install` command when you want to install the app on a new site.
- Once the app is installed on a site, the site picks up the new app changes you deploy without needing to rerun the install command.

## Support

See [Get help](https://developer.atlassian.com/platform/forge/get-help/) for how to get help and provide feedback.

