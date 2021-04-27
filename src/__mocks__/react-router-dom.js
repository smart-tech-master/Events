module.exports = {
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(() => ({
    search: '',
    pathname: '',
  })),
}
