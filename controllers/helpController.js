module.exports = {
  getHelpData(req, res) {
    return res.render('help', {
      title: 'Help',
      name: 'Lorenz Afable',
      content: 'You can find the FAQs here',
    });
  },
};
