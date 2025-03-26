const XML_TEMPLATE = {
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

  navTop: `
    <HBox fitContainer="true">
      <VBox width="20%">
        <core:Fragment fragmentName="com.thesistues.ui5app.view.NavigationFragment" type="XML"/>
      </VBox>
      <VBox width="80%">`,

  navBottom: `
      </VBox>
    </HBox>`,

  content: (listItems: string) => `
    ${listItems}
  `,
  navFragmentTop:
    '<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core" xmlns:l="sap.ui.layout">',
  navFragmentBottom: '</core:FragmentDefinition>',
  navController: `
    import Controller from "sap/ui/core/mvc/Controller";
    import UI5Element from "sap/ui/core/Element";
    import UIComponent from "sap/ui/core/UIComponent";
    import Page from "sap/m/Page";

    export default class Main extends Controller {
      public onNavigateTo(oEvent: UI5Element): void {
        const key = oEvent.getSource().data("Key") as string;
        const oPage = this.getView()?.byId("page") as Page;
        const oHeading = this.getView()?.byId(key);

        if (oPage && oHeading) {
          oPage.scrollToElement(oHeading, 500);
        }
      }
    }
    `,
};

export default XML_TEMPLATE;
