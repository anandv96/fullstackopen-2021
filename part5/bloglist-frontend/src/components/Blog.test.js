import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";
import BlogForm from "./BlogForm";

test("renders title and author not url and likes", async () => {
  const blog = {
    title: "test blog",
    author: "alice",
    url: "example.com",
    likes: 17,
  };

  const component = render(<Blog blog={blog} />);

  const blogTitleAuthor = component.getByTestId("blogTitleAuthor");

  const url = await component.queryByTestId("url");
  const likes = await component.queryByTestId("likes");

  expect(blogTitleAuthor).toHaveTextContent("test blog");

  expect(url).toBeNull();
  expect(likes).toBeNull();
});

test("click show more shows more", async () => {
  const blog = {
    title: "test blog",
    author: "alice",
    url: "example.com",
    likes: 17,
  };

  const component = render(<Blog blog={blog} />);

  const viewButton = component.getByTestId("viewButton");
  userEvent.click(viewButton);

  const blogTitleAuthor = component.getByTestId("blogTitleAuthor");
  const url = await component.queryByTestId("url");
  const likes = await component.queryByTestId("likes");

  expect(blogTitleAuthor).toHaveTextContent("test blog");
  expect(url).toHaveTextContent("example.com");
  expect(likes).toHaveTextContent("17");
});

test("click like twice calls event handler twice", async () => {
  const blog = {
    title: "test blog",
    author: "alice",
    url: "example.com",
    likes: 17,
  };
  const mockHandler = jest.fn();
  const component = render(<Blog blog={blog} likeClick={mockHandler} />);

  const viewButton = component.getByTestId("viewButton");

  userEvent.click(viewButton);

  const likeButton = component.getByTestId("likeButton");

  await userEvent.click(likeButton);
  await userEvent.click(likeButton);

  expect(mockHandler.mock.calls).toHaveLength(2);
});

test("blog creation form correct details", async () => {
  const createBlog = jest.fn();
  const component = render(<BlogForm handleCreateBlog={createBlog} />);

  const titleInput = component.getByTestId("title");
  userEvent.type(titleInput, "test blog");

  const authorInput = component.getByTestId("author");
  userEvent.type(authorInput, "alice");

  const urlInput = component.getByTestId("url");
  userEvent.type(urlInput, "example.com");

  userEvent.click(component.getByTestId("createBlog"));

  expect(createBlog).toBeCalledWith("test blog", "alice", "example.com");
});
