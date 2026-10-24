import React, { useEffect, useState } from "react";
import "./tags.css";

function Tags() {
  const [tags, setTags] = useState(() => {
    const storedTags = localStorage.getItem("tags");

    if (storedTags) {
      return JSON.parse(storedTags);
    }

    return [
      { id: 1, name: "Work" },
      { id: 2, name: "Study" },
      { id: 3, name: "Important" },
    ];
  });

  const [tagName, setTagName] = useState("");

  // Create a new tag and add it to the list.
  const handleCreateTag = () => {
    const name = tagName.trim();

    if (!name) {
      alert("Please enter a tag name.");
      return;
    }

    const newTag = {
      id: Date.now(),
      name,
    };

    setTags((prevTags) => [
      ...prevTags,
      newTag,
    ]);

    setTagName("");
  };

  // Delete a tag after confirmation.
  const handleDeleteTag = (tagId) => {
    const confirmed = window.confirm(
      "Delete this tag?"
    );

    if (!confirmed) {
      return;
    }

    setTags((prevTags) =>
      prevTags.filter((tag) => tag.id !== tagId)
    );
  };

  // Keep tags saved in localStorage.
  useEffect(() => {
    localStorage.setItem(
      "tags",
      JSON.stringify(tags)
    );
  }, [tags]);

  return (
    <main className="tags-page">
      <div className="tags-container">
        <div className="tags-header">
          <div>
            <h1>Tags</h1>

            <p>
              Add tags to organize your notes.
            </p>
          </div>

          <div className="create-tag-box">
            <input
              type="text"
              placeholder="Tag name"
              value={tagName}
              onChange={(event) =>
                setTagName(event.target.value)
              }
            />

            <button onClick={handleCreateTag}>
              + Create Tag
            </button>
          </div>
        </div>

        <section className="tags-grid">
          {tags.map((tag) => (
            <article
              className="tag-card"
              key={tag.id}
            >
              <div className="tag-icon">
                #
              </div>

              <div className="tag-info">
                <h3>{tag.name}</h3>
              </div>

              <button
                className="tag-delete-btn"
                onClick={() =>
                  handleDeleteTag(tag.id)
                }
              >
                🗑️
              </button>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

export default Tags;