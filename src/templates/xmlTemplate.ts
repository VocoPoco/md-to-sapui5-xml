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
    }">

    <Page title="{i18n>appTitle}" id="page">
      <content>
      `,

  bottom: `      
        </ScrollContainer>
      </content>
    </Page>
</mvc:View>`,

  navTop: `
    <HBox fitContainer="true">
      <VBox width="20%">
        <ScrollContainer height="100%" vertical="true">
          <core:Fragment fragmentName="com.thesistues.ui5app.view.NavigationFragment" type="XML"/>
        </ScrollContainer>
      </VBox>
      <VBox width="80%">
        <ScrollContainer height="100%" vertical="true">
      `,

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
    import Link from 'sap/m/Link';
    import Page from 'sap/m/Page';
    import Event from 'sap/ui/base/Event';
    import Controller from 'sap/ui/core/mvc/Controller';

    export default class Main extends Controller {
      public onNavigateTo(oEvent: Event): void {
        const oLink = oEvent.getSource();
        const key = (oLink as Link).data('theHeading') as string;

        const oPage = this.getView()?.byId('page') as Page;
        const oHeading = this.getView()?.byId(key);

        if (oPage && oHeading) {
          console.log('heading to header');
          oPage.scrollToElement(oHeading, 500);
        }
      }
    }
    `,
};

export default XML_TEMPLATE;
