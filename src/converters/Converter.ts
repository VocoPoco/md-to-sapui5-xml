/**
 * Abstract base class for all converters.
 */
abstract class Converter<InputType, OutputType> {
  constructor() {
    if (new.target === Converter) {
      throw new Error('Cannot instantiate abstract class Converter directly.');
    }
  }

  /**
   * Converts the input data to the output format.
   * Must be implemented by subclasses.
   * @param input - The input data.
   * @returns The transformed output data (sync or async).
   */
  public abstract convert(input: InputType): OutputType | Promise<OutputType>;
}

export default Converter;
