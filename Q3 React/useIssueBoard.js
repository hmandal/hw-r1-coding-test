import { useState, useEffect } from 'react';

export function useIssueBoard(loadIssues) {
  const [query, setQuery] = useState('');
  const [debounceSearch, setDebounceSearch] = useState('');


  const [status, setStatus] = useState('ALL');
  const [issues, setIssues] = useState([]);
  const [selectedId, setSelectedId] = useState(null);


  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const searchTimerId = setTimeout(() => {
        setDebounceSearch(query);
    }, 300);
    return () => clearTimeout(searchTimerId);
  },[query]);




  useEffect(() => {
    setLoading(true);
    setError(null);


    loadIssues({ query: debounceSearch, status })
      .then((data) => {
        // TODO: Abort loading logic
        // const controller = new AbortController();


        setIssues(data);
        setLoading(false);


        // reset/preserve selection logic
        setSelectedId((prevId) => (prevId && data.some((i) => i.id === prevId) ? prevId : null));
      })
      .catch((err) => {
        setError(err.message || 'Unknown Error: Please retry or refrseh');
        setLoading(false);
      });
  }, [debounceSearch, status, loadIssues]);


  // TODO: Retry logic, avoid re-rendering uncessarily? & other optimisations


  return {
    query,
    setQuery,

    status,
    setStatus,

    issues,

    selectedId,
    setSelectedId,

    error,
    loading,
  };
}
