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

    return headings
      .map(
        (heading) => `
          <CustomListItem>
            <HBox class="sapUiTinyMargin" width="100%" alignItems="Center" justifyContent="Center">
              <VBox justifyContent="Center" width="100%">
                <Link text="${heading.text}" press="onNavigateTo">
                    <customData>
                      <core:customData key="theHeading" value="${heading.id}"/>
                  </customData>
                </Link>
              </VBox>
            </HBox>
          </CustomListItem>
        `,
      )
      .join('');
  }
}

export default NavigationFragmentGenerator;
