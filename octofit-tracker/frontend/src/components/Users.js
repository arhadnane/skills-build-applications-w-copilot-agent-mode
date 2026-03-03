const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
export const USERS_API_URL = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/users/`
  : 'http://localhost:8000/api/users/';

function Users() {
  return null;
}

export default Users;
