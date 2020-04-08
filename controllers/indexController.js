module.exports = {
  getIndexData(req, res) {
    return res.render('index', {
      title: 'Weather',
      name: 'Lorenz Afable',
    });
  },
};
