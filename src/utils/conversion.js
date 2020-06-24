exports.mpsToKph = (meterPerSecond) => {
  if (typeof meterPerSecond !== 'number') return 0;
  return Math.round(meterPerSecond * 3.6);
};
