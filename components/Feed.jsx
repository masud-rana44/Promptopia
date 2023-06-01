'use client';

import { useState, useEffect } from 'react';

import PromptCard from './PromptCard';
import Loader from './Loader';

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTimeOut, setSearchTimeOut] = useState(null);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeOut);
    setSearchText(e.target.value);

    setSearchTimeOut(
      setTimeout(() => {
        const searchResult = posts.filter(
          (post) =>
            post.prompt.toLowerCase().includes(searchText.toLowerCase()) ||
            post.tag.toLowerCase().includes(searchText.toLowerCase()) ||
            post.creator.username
              .toLowerCase()
              .includes(searchText.toLowerCase())
        );

        setSearchResults(searchResult);
      }, 500)
    );
  };

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/prompt');
        const data = await response.json();

        setPosts(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleTagClick = (tagName) => {
    setSearchText(tagName);
    const searchResult = posts.filter((post) =>
      post.tag.toLowerCase().includes(tagName.toLowerCase())
    );

    setSearchResults(searchResult);
  };

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>

      {loading ? (
        <div className="mt-12">
          <Loader />
        </div>
      ) : searchText ? (
        <PromptCardList data={searchResults} handleTagClick={handleTagClick} />
      ) : (
        <PromptCardList data={posts} handleTagClick={handleTagClick} />
      )}
    </section>
  );
};

export default Feed;
