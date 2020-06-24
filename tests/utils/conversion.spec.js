const { mpsToKph } = require('../../src/utils/conversion');

describe('conversion', () => {
  describe('mpsToKph', () => {
    it('should convert 1mps to 4kph', () => {
      const converted = mpsToKph(1);

      expect(converted).toBe(4);
    });

    it('should convert 2mps to 7kph', () => {
      const converted = mpsToKph(2);

      expect(converted).toBe(7);
    });

    it('should return 0 if a non-number primitive is passed as input', () => {
      const inputs = ['hello', true, false, null, undefined];

      inputs.forEach((input) => {
        expect(mpsToKph(input)).toBe(0);
      });
    });

    it('should return 0 if an object is passed as input', () => {
      const inputs = [{ input: 1 }, [1, 2, 3]];

      inputs.forEach((input) => {
        expect(mpsToKph(input)).toBe(0);
      });
    });
  });
});
