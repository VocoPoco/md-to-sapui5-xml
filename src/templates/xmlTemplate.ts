export const XML_TEMPLATE = {
  top: `<mvc:View
    controllerName="com.thesistues.ui5app.controller.Main"
    displayBlock="true"
    xmlns="sap.m"
    xmlns:mvc="sap.ui.core.mvc"
    xmlns:core="sap.ui.core"
    xmlns:code="sap.ui.codeeditor"
    core:require="{
      formatter: 'com/thesistues/ui5app/model/formatter'
    }'">

    <Page title="{i18n>appTitle}" id="page">
      <content>`,
  bottom: `      </content>
    </Page>
</mvc:View>`,
};
