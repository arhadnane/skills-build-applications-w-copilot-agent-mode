import { useCallback, useEffect, useMemo, useState } from 'react';
import './App.css';
import DataSection from './components/DataSection';
import TopNav from './components/TopNav';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://127.0.0.1:8000/api';

const sectionConfig = {
  users: {
    title: 'Users',
    description: 'Manage user accounts and profiles.',
    endpoint: 'users',
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'username', label: 'Username' },
      { key: 'email', label: 'Email' },
    ],
    fields: [
      { name: 'username', label: 'Username' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'password', label: 'Password', type: 'password' },
    ],
  },
  teams: {
    title: 'Teams',
    description: 'Create and organize training teams.',
    endpoint: 'teams',
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Team Name' },
      {
        key: 'members',
        label: 'Members',
        render: (item) => (Array.isArray(item.members) ? item.members.map((member) => member.username).join(', ') : ''),
      },
    ],
    fields: [{ name: 'name', label: 'Team Name' }],
  },
  activities: {
    title: 'Activities',
    description: 'Track daily activities and duration.',
    endpoint: 'activities',
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'activity_type', label: 'Activity' },
      { key: 'duration', label: 'Duration (min)' },
      { key: 'date', label: 'Date' },
    ],
    fields: [
      { name: 'user_id', label: 'User ID', type: 'number' },
      { name: 'activity_type', label: 'Activity Type' },
      { name: 'duration', label: 'Duration (min)', type: 'number' },
      { name: 'date', label: 'Date', type: 'date' },
    ],
  },
  leaderboard: {
    title: 'Leaderboard',
    description: 'Compare scores and rankings.',
    endpoint: 'leaderboard',
    columns: [
      { key: 'id', label: 'ID' },
      {
        key: 'user',
        label: 'User',
        render: (item) => item.user?.username || '',
      },
      { key: 'score', label: 'Score' },
    ],
    fields: [
      { name: 'user_id', label: 'User ID', type: 'number' },
      { name: 'score', label: 'Score', type: 'number' },
    ],
  },
  workouts: {
    title: 'Workouts',
    description: 'Save and reuse workout templates.',
    endpoint: 'workouts',
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Workout Name' },
      { key: 'description', label: 'Description' },
    ],
    fields: [
      { name: 'name', label: 'Workout Name' },
      { name: 'description', label: 'Description' },
      { name: 'exercises', label: 'Exercises (comma separated)' },
    ],
  },
};

const navSections = [
  { id: 'users', label: 'Users' },
  { id: 'teams', label: 'Teams' },
  { id: 'activities', label: 'Activities' },
  { id: 'leaderboard', label: 'Leaderboard' },
  { id: 'workouts', label: 'Workouts' },
];

function App() {
  const [activeSection, setActiveSection] = useState('users');
  const [data, setData] = useState({
    users: [],
    teams: [],
    activities: [],
    leaderboard: [],
    workouts: [],
  });

  const fetchSectionData = useCallback(async (sectionId) => {
    const section = sectionConfig[sectionId];
    const response = await fetch(`${API_BASE}/${section.endpoint}/`);
    const json = await response.json();
    setData((previous) => ({ ...previous, [sectionId]: Array.isArray(json) ? json : [] }));
  }, []);

  const fetchAll = useCallback(async () => {
    for (const section of navSections) {
      await fetchSectionData(section.id);
    }
  }, [fetchSectionData]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const createItem = async (sectionId, formData) => {
    const section = sectionConfig[sectionId];
    const payload = { ...formData };

    if (sectionId === 'activities') {
      payload.duration = Number(payload.duration);
      payload.user_id = Number(payload.user_id);
    }

    if (sectionId === 'leaderboard') {
      payload.score = Number(payload.score);
      payload.user_id = Number(payload.user_id);
    }

    if (sectionId === 'workouts') {
      payload.exercises = payload.exercises
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
        .map((name) => ({ name }));
    }

    await fetch(`${API_BASE}/${section.endpoint}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    await fetchSectionData(sectionId);
  };

  const currentSection = useMemo(() => sectionConfig[activeSection], [activeSection]);

  return (
    <div className="app-shell bg-light min-vh-100">
      <div className="container py-4">
        <TopNav sections={navSections} activeSection={activeSection} onSectionChange={setActiveSection} />

        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <h1 className="display-6 fw-semibold mb-2">OctoFit React Dashboard</h1>
            <p className="text-secondary mb-0">
              Clean Bootstrap UI with consistent navigation, cards, tables, forms, links, buttons, and modals.
            </p>
          </div>
        </div>

        <DataSection
          title={currentSection.title}
          description={currentSection.description}
          linkHref={`${API_BASE}/${currentSection.endpoint}/`}
          linkLabel={`Open ${currentSection.title} API`}
          columns={currentSection.columns}
          data={data[activeSection]}
          fields={currentSection.fields}
          onCreate={(payload) => createItem(activeSection, payload)}
        />
      </div>
    </div>
  );
}

export default App;
