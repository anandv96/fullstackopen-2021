describe("Blog app", function () {
  const user = {
    blogs: [],
    username: "alice",
    name: "alice",
    password: "alice_password",
  };

  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    cy.request("POST", "http://localhost:3003/api/users/", user);
    cy.visit("http://localhost:3000");
  });

  it("Login form is shown", function () {
    cy.get('[data-testid="login-form"]').should("be.visible");
  });

  describe("login", function () {
    it("succeeds with correct credentials", function () {
      cy.get('[data-testid="username"]').type(user.username);
      cy.get('[data-testid="password"]').type(user.password);

      cy.get('[data-testid="login-button"]').click();

      cy.get('[data-testid="login-form"]').should("not.exist");
      cy.get('[data-testid="title-blogs"]').should("have.text", "blogs");
      cy.get('[data-testid="logout-button"]').click();
      cy.get('[data-testid="login-form"]').should("be.visible");
    });

    it("fails with wrong credentials", function () {
      cy.get('[data-testid="username"]').type("bob");
      cy.get('[data-testid="password"]').type("bob_password");
      cy.get('[data-testid="login-button"]').click();
      cy.get('[data-testid="text"]').should(
        "have.text",
        "wrong username or password"
      );
    });
  });

  describe("When logged in", function () {
    beforeEach(async function () {
      const response = await cy.request(
        "POST",
        "http://localhost:3003/api/login",
        {
          username: user.username,
          password: user.password,
        }
      );

      window.localStorage.setItem(
        "loggedBlogAppUser",
        JSON.stringify(response.body)
      );
      cy.visit("http://localhost:3000");
    });

    it("A blog can be created", function () {
      cy.get('[data-testid="toggleButton"]').click();
      cy.get('[data-testid="title"]').type("test blog creation");
      cy.get('[data-testid="author"]').type("alice");
      cy.get('[data-testid="url"]').type("example.com");
      cy.get('[data-testid="createBlog"]').click();

      cy.get('[data-testid="text"]').should(
        "have.text",
        "a new blog test blog creation by alice added"
      );
    });

    it("A blog can be liked", function () {
      cy.get('[data-testid="toggleButton"]').click();

      cy.get('[data-testid="title"]').type("test blog");
      cy.get('[data-testid="author"]').type("alice");
      cy.get('[data-testid="url"]').type("example.com");

      cy.get('[data-testid="createBlog"]').click();

      cy.get('[data-testid="blogTitleAuthor"]').should(
        "have.text",
        "test blog alice"
      );
      cy.get('[data-testid="viewButton"]').click();

      cy.get('[data-testid="likes"]').contains("0");
      cy.get('[data-testid="likeButton"]').click();
      cy.get('[data-testid="likes"]').contains("1");
    });

    it("A blog can be deleted by the user who created it", function () {
      cy.get('[data-testid="toggleButton"]').click();

      cy.get('[data-testid="title"]').type("test blog deletion");
      cy.get('[data-testid="author"]').type("alice");
      cy.get('[data-testid="url"]').type("example.com");

      cy.get('[data-testid="createBlog"]').click();

      cy.get('[data-testid="viewButton"]').click();
      cy.get('[data-testid="removeButton"]').click();
      cy.on("windows:confirm", () => true);
      cy.should("not.contain", "test blog deletion");
    });

    it("The blogs are ordered according to likes", function () {
      cy.createBlog({
        title: "test blog medium popular",
        author: "bob",
        url: "example.com",
        likes: 2,
      });
      cy.createBlog({
        title: "test blog most popular",
        author: "alice",
        url: "example.com",
        likes: 3,
      });
      cy.createBlog({
        title: "test blog least popular",
        author: "carol",
        url: "example.com",
        likes: 1,
      });

      cy.get(".blog>.blogTitleAuthor").should((items) => {
        console.log(items);
        expect(items[0].innerHTML).to.contain("test blog most popular");
        expect(items[1].innerHTML).to.contain("test blog medium popular");
        expect(items[2].innerHTML).to.contain("test blog least popular");
      });
    });
  });
});
