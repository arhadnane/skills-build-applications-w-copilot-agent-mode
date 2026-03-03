const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
export const TEAMS_API_URL = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/teams/`
  : 'http://localhost:8000/api/teams/';

function Teams() {
  return null;
}

export default Teams;
