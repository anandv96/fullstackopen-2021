var _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, curr) => sum + curr.likes, 0);
};

const favoriteBlog = (blogs) => {
  blogs.sort((a, b) => b.likes - a.likes);
  const result = {
    title: blogs[0].title,
    author: blogs[0].author,
    likes: blogs[0].likes,
  };
  return result;
};

const mostBlogs = (blogs) => {
  const authorBlogs = _.countBy(blogs, "author");

  let sortableAuthors = [];
  _.forIn(authorBlogs, function (value, key) {
    sortableAuthors = sortableAuthors.concat({
      author: key,
      blogs: value,
    });
  });
  sortableAuthors.sort((a, b) => b.blogs - a.blogs);
  return sortableAuthors[0];
};

const mostLikes = (blogs) => {
  const authorLikes = _.reduce(
    blogs,
    (result, blog) => {
      if (!result[blog.author]) {
        result[blog.author] = 0;
      }
      result[blog.author] += blog.likes;
      return result;
    },
    {}
  );

  let sortableAuthors = [];
  _.forIn(authorLikes, function (value, key) {
    sortableAuthors = sortableAuthors.concat({
      author: key,
      likes: value,
    });
  });
  sortableAuthors.sort((a, b) => b.likes - a.likes);
  return sortableAuthors[0];
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
