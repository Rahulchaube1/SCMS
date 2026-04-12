# Salesforce Deployment & Domain Setup Guide

Follow these steps to deploy your application logic and configure your domain on Salesforce.

## 1. Create a Domain Name (My Domain)
Salesforce requires a custom domain for deploying Lightning Web Components (LWCs).

1. Log in to your Salesforce Developer Edition.
2. Click the **Gear Icon** (Setup) and type **"My Domain"** in the Quick Find box.
3. Choose a unique name for your domain (e.g., `rahulcloud-dev-ed`).
4. Click **Check Availability**.
5. Once confirmed, click **Register Domain**.
6. Wait for the email confirmation, then log back in.
7. Click **Deploy to Users** in the "My Domain" settings page.

## 2. Prepare Data Objects
Before deploying the code, create the custom object:
1. Go to **Object Manager** -> **Create** -> **Custom Object**.
2. **Label**: Cloud Task
3. **Plural Label**: Cloud Tasks
4. **Object Name**: `Cloud_Task`
5. Create a Custom Field:
   - **Type**: Long Text Area
   - **Field Label**: Description
   - **API Name**: `Description__c`
   - **Type**: Picklist
   - **Field Label**: Status
   - **API Name**: `Status__c` (Values: New, In Progress, Completed)

## 3. Deploy the Application
1. Use VS Code with **Salesforce Extension Pack**.
2. Connect to your org with `SFDX: Authorize an Org`.
3. Right-click the `CloudManager.cls` and select `SFDX: Deploy Source to Org`.
4. Right-click the `cloudManagerComp` folder and select `SFDX: Deploy Source to Org`.

## 4. Deploy in Real Time
1. Open the **App Launcher** (9 dots) and search for **"Sales"** or any app.
2. Click the **Gear Icon** -> **Edit Page**.
3. Locate **cloudManagerComp** under "Custom" components on the left sidebar.
4. Drag and drop it onto the page.
5. Click **Save** and **Activate**.
6. Set as **Org Default** and click **Save**.

Your application is now live on your Salesforce custom domain!
