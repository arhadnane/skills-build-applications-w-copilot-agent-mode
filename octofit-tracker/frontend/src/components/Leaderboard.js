const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
export const LEADERBOARD_API_URL = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/leaderboard/`
  : 'http://localhost:8000/api/leaderboard/';

function Leaderboard() {
  return null;
}

export default Leaderboard;
