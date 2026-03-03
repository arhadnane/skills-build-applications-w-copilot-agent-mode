const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
export const ACTIVITIES_API_URL = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/activities/`
  : 'http://localhost:8000/api/activities/';

function Activities() {
  return null;
}

export default Activities;
