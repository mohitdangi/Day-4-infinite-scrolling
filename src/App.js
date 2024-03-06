import React, { useState, useEffect, useCallback } from "react";

const useInfiniteScroll = (fetchDataCallback) => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false); // Add loading state

  const fetchData = useCallback(async () => {
    try {
      setLoading(true); // Set loading to true while fetching data
      const data = await fetchDataCallback(page);
      setItems((prev) => [...prev, ...data]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading back to false after fetching data
    }
  }, [fetchDataCallback, page]);

  const handleScroll = useCallback(() => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const bottomThreshold = 100;

    if (documentHeight - (scrollTop + windowHeight) < bottomThreshold) {
      setPage((prev) => prev + 1);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { items, loading }; // Return loading state
};

const fetchData = async (page) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`
  );
  const data = await response.json();
  return data;
};

const App = () => {
  const { items, loading } = useInfiniteScroll(fetchData);

  return (
    <div>
      <h1>Infinite Scroll Example</h1>
      <div>
        {items.map((item) => (
          <div key={item.id}>
            <h2>{item.title}</h2>
            <p>{item.body}</p>
          </div>
        ))}
        {loading && <p>Loading...</p>} {/* Show loading indicator */}
      </div>
    </div>
  );
};

export default App;
