import React from 'react';
import { useIssueBoard } from './useIssueBoard';

export function IssueBoard({ loadIssues }) {

  const {
    query,
    setQuery,
    status,
    setStatus,
    issues,
    selectedId,
    setSelectedId,
    error,
    loading,
  } = useIssueBoard(loadIssues);

  // TODO: accessibility

  return (
    <div>
      <div>
        <label>Search issues:</label>
        <input id="search-box"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search issues..."
          aria-label="Search issues..."
        />


        <label>Filter isues by status:</label>
        <select id="status-filter"
          aria-label="Filter by status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="ALL">All</option>
          <option value="OPEN">Open</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>


      {loading && <p>Loading issues...</p>}

      {!loading && !error && issues.length === 0 && <p>No search results.</p>}

      <ul>
        {issues.map((issue) => (
          <li
            key={issue.id}
            onClick={() => setSelectedId(issue.id)}
          >
            {issue.title}: ({issue.status})
          </li>
        ))}
      </ul>
    </div>
  );
}
