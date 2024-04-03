import { buildClient } from '@datocms/cma-client-browser';
import { useState } from 'react';
import { useSiteSearch } from 'react-datocms';
import ReactPaginate from 'react-paginate';
import './style.css';

const client = buildClient({
  apiToken: 'faeb9172e232a75339242faafb9e56de8c8f13b735f7090964',
});

export default function SiteSearchExamples() {
  const [query, setQuery] = useState('');
  const { state, error, data } = useSiteSearch({
    client,
    buildTriggerId: '7497',
    // optional: you can omit it you only have one locale, or you want to find results in every locale
    initialState: { locale: 'en' },
    // optional: by default fuzzy-search is not active
    fuzzySearch: true,
    // optional: defaults to 8 search results per page
    resultsPerPage: 5,
  });
  return (
    <div className="example" data-title="Basic example">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          state.setQuery(query);
        }}
      >
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Search: try something like "react" or "dato"... '
        />
      </form>
      {!data && !error && <p>Loading...</p>}
      {error && <p>Error! {error}</p>}
      {data && (
        <>
          <div className="results">
            {data.pageResults.map((result) => (
              <div key={result.id} className="result">
                <a href={result.url} className="result-title">
                  {result.title}
                </a>
                <div className="result-highlights">
                  <div>{result.bodyExcerpt}</div>
                  <div>{result.url}</div>
                </div>
              </div>
            ))}
          </div>
          <p>Total results: {data.totalResults}</p>
          <ReactPaginate
            className="react-paginate"
            pageCount={data.totalPages}
            forcePage={state.page}
            onPageChange={({ selected }) => {
              state.setPage(selected);
            }}
            activeClassName="active"
            renderOnZeroPageCount={() => null}
          />
        </>
      )}
    </div>
  );
}
