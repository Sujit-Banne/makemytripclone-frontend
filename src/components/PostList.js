import React from 'react';
import { deletePost, updatePost } from '../services/api';

export default function PostList({ posts, onPostDeleted, onPostUpdated }) {
  const [editingId, setEditingId] = React.useState(null);
  const [editData, setEditData] = React.useState({});

  const handleDelete = async (id) => {
    try {
      await deletePost(id);
      onPostDeleted();
    } catch (err) {
      alert('Failed to delete post');
    }
  };

  const handleEdit = (post) => {
    setEditingId(post._id);
    setEditData({ title: post.title, content: post.content });
  };

  const handleUpdate = async (id) => {
    try {
      await updatePost(id, editData);
      setEditingId(null);
      onPostUpdated();
    } catch (err) {
      alert('Failed to update post');
    }
  };

  return (
    <div>
      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts yet</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="bg-white p-6 rounded-lg shadow-md mb-4">
            {editingId === post._id ? (
              <>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) =>
                    setEditData({ ...editData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md mb-2"
                />
                <textarea
                  value={editData.content}
                  onChange={(e) =>
                    setEditData({ ...editData, content: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
                  rows="5"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(post._id)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                <p className="text-gray-700 mb-2">{post.content}</p>
                <p className="text-sm text-gray-500 mb-4">
                  By {post.userId.name} • {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(post)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}
