module.exports = {
  getAboutData(req, res) {
    return res.render('about', {
      title: 'About me',
      name: 'Lorenz Afable',
    });
  },
};
