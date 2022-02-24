const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
});

describe("Get blogs", () => {
  test("blogs are returned properly", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  }, 10000);

  test("blogs have id", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    for (tempBlog of response.body) {
      expect(tempBlog.id).toBeDefined();
    }
  }, 10000);
});

describe("Post blogs", () => {
  test("blog can be posted", async () => {
    const newBlog = {
      title: "test blog",
      author: "alice",
      url: "example.com",
      likes: 17,
    };

    await api
      .post("/api/users")
      .send({ name: "alice", username: "alice", password: "alice_password" });

    const user = await api
      .post("/api/login")
      .send({ username: "alice", password: "alice_password" })
      .expect(200)
      .expect("Content-type", /application\/json/);

    const res = await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", `bearer ${user.body.token}`)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();

    const contents = blogsAtEnd.map((r) => r.title);

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
    expect(contents).toContain("test blog");
  });

  test("blog missing likes defaults to zero", async () => {
    const newBlog = {
      title: "test no likes",
      author: "alice",
      url: "example.com",
    };
    await api
      .post("/api/users")
      .send({ name: "alice", username: "alice", password: "alice_password" });

    const user = await api
      .post("/api/login")
      .send({ username: "alice", password: "alice_password" })
      .expect(200)
      .expect("Content-type", /application\/json/);

    const response = await api
      .post("/api/blogs")
      .set("Authorization", `bearer ${user.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    expect(response.body.likes).toBe(0);
  });

  test("blog missing url and title not added", async () => {
    const newBlog = {
      author: "alice",
      likes: 17,
    };
    await api
      .post("/api/users")
      .send({ name: "alice", username: "alice", password: "alice_password" });

    const user = await api
      .post("/api/login")
      .send({ username: "alice", password: "alice_password" })
      .expect(200)
      .expect("Content-type", /application\/json/);

    await api
      .post("/api/blogs")
      .set("Authorization", `bearer ${user.body.token}`)
      .send(newBlog)
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });

  test("blog missing title not added", async () => {
    const newBlog = {
      author: "alice",
      url: "example.com",
      likes: 17,
    };
    await api
      .post("/api/users")
      .send({ name: "alice", username: "alice", password: "alice_password" });

    const user = await api
      .post("/api/login")
      .send({ username: "alice", password: "alice_password" })
      .expect(200)
      .expect("Content-type", /application\/json/);

    await api
      .post("/api/blogs")
      .set("Authorization", `bearer ${user.body.token}`)
      .send(newBlog)
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });

  test("blog missing url not added", async () => {
    const newBlog = {
      title: "test no url",
      author: "alice",
      likes: 17,
    };
    await api
      .post("/api/users")
      .send({ name: "alice", username: "alice", password: "alice_password" });

    const user = await api
      .post("/api/login")
      .send({ username: "alice", password: "alice_password" })
      .expect(200)
      .expect("Content-type", /application\/json/);

    await api
      .post("/api/blogs")
      .set("Authorization", `bearer ${user.body.token}`)
      .send(newBlog)
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });
});

describe("Delete blogs", () => {
  test("delete an inserted blog", async () => {
    await api.post("/api/users").send({
      name: "alice",
      username: "alice",
      password: "alice_password",
    });

    const user = await api
      .post("/api/login")
      .send({
        username: "alice",
        password: "alice_password",
      })
      .expect(200)
      .expect("Content-type", /application\/json/);

    const newBlog = {
      title: "test blog to delete",
      author: "alice",
      url: "example.com",
      likes: 17,
    };
    let addedBlog = await api
      .post("/api/blogs")
      .set("Authorization", `bearer ${user.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    await api
      .delete(`/api/blogs/${addedBlog.body.id}`)
      .set("Authorization", `bearer ${user.body.token}`)
      .expect(204);
  });
});

describe("Update blogs ", () => {
  test("update likes", async () => {
    const idTobeUpdated = await helper.createNewBlog();
    const newBlog = {
      title: "new test blog",
      author: "alice",
      url: "example.com",
      likes: 16,
    };
    await api.put(`/api/blogs/${idTobeUpdated}`).send(newBlog).expect(200);

    const blogsAtEnd = await helper.blogsInDb();
    const updated = blogsAtEnd.find((r) => r.id == idTobeUpdated);
    expect(updated.title).toBe("new test blog");
    expect(updated.likes).toBe(16);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
