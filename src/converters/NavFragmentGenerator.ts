import XML_TEMPLATE from '../templates/xmlTemplate.js';
import NavFragmentHandler from './processors/NavFragmentHandler.js';

/**
 * Generates an SAPUI5 fragment XML containing navigation links to headings.
 */
class NavigationFragmentGenerator {
  /**
   * Generates the XML content for the navigation menu.
   * @returns A string containing the generated XML fragment.
   */
  public static generateFragment(): string {
    const headings = NavFragmentHandler.getHeadings();

    const listItems = headings
      .map(
        (heading) => `
          <CustomListItem>
            <HBox>
              <Link text="${heading.text}" press="onNavigateTo">
                  <customData>
                    <core:customData key="theHeading" value="${heading.id}"/>
                </customData>
              </Link>
            </HBox>
          </CustomListItem>
        `,
      )
      .join('');

    return (
      XML_TEMPLATE.navFragmentTop +
      XML_TEMPLATE.content(listItems) +
      XML_TEMPLATE.navFragmentBottom
    );
  }

  /**
   * Generates the SAPUI5 Main controller.
   * @returns The content of the Main.controller.ts file.
   */
  public static generateController(): string {
    return XML_TEMPLATE.navController;
  }
}

export default NavigationFragmentGenerator;
