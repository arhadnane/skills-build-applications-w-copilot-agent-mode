const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
export const WORKOUTS_API_URL = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/workouts/`
  : 'http://localhost:8000/api/workouts/';

function Workouts() {
  return null;
}

export default Workouts;
