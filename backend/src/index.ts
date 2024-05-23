import express from "express";
import dotenv from "dotenv";
import generator from "generate-password";
import { Post, PrismaClient } from "@prisma/client";
import { createUser, editUser, getAllUsers, getPosts, getUser } from "./db";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import cors from "cors";
dotenv.config();

const prisma = new PrismaClient();

const getVoteCount = (post) => {
  const upVotesCount = post.votes.filter(
    (vote) => vote.voteType === "Upvote"
  ).length;
  const downVotesCount = post.votes.length - upVotesCount;
  return upVotesCount - downVotesCount + 1;
};

async function main() {
  await prisma.$connect();
  console.log("Connected to Prisma");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT;

app.get("/", (req: any, res: { send: (arg0: string) => void }) => {
  res.send("Express + TypeScript Server");
});

app.get("/users/all", async (req, res) => {
  const users = await getAllUsers();
  const userArray = users.map((user) => {
    return { ...user, password: undefined };
  });

  res.json(userArray);
});

app.get("/users", async (req, res) => {
  const email = req.query;
  const result = await getUser(email.toString());
  try {
    if (result) {
      res.send(email);
      res.json({
        error: undefined,
        data: {
          id: result.id,
          email: result.email,
          username: result.username,
          firstName: result.firstName,
          lastName: result.lastName,
        },
        success: true,
      });
    } else {
      res
        .status(404)
        .json({ error: "UserNotFound", data: undefined, success: false });
    }
  } catch (e) {
    res
      .status(500)
      .json({ error: "ServerError", data: undefined, success: false });
  }
});

app.get("/posts", async (req, res) => {
  const params = req.query;
  let posts = await getPosts();
  if (params.sort === "recent") {
    posts = posts.sort(
      (firstItem: Post, secondItem: Post) =>
        firstItem.dateCreated.getUTCDate() - secondItem.dateCreated.getUTCDate()
    );
  } else {
    posts = posts.sort(
      (firstItem: Post, secondItem: Post) =>
        getVoteCount(secondItem) - getVoteCount(firstItem)
    );
  }
  res.json(posts);
});

app.post("/users/new", async (req, res) => {
  const user = { ...req.body };
  user.password = generator.generate({
    length: 10,
    strict: true,
  });

  if (!user) {
    res.send("error");
    return;
  }

  try {
    const resp = await createUser(
      user.username,
      user.email,
      user.password,
      user.firstName,
      user.lastName
    );

    if (resp && typeof resp !== "string") {
      res.status(201).json({
        error: undefined,
        data: {
          id: resp.id,
          email: resp.email,
          username: resp.username,
          firstName: resp.firstName,
          lastName: resp.lastName,
        },
        success: true,
      });
    }
  } catch (e) {
    console.error(e);
    // console.error(typeof e.meta.target);

    if (e instanceof PrismaClientKnownRequestError) {
      if (
        e?.meta?.target instanceof Array &&
        e.meta?.target?.includes("email")
      ) {
        res.status(409).json({
          error: "EmailAlreadyInUse",
          data: undefined,
          success: false,
        });
      } else if (
        e?.meta?.target instanceof Array &&
        e.meta?.target?.includes("username")
      ) {
        res.status(409).json({
          error: "UsernameAlreadyTaken",
          data: undefined,
          success: false,
        });
      }
    } else if (e instanceof PrismaClientValidationError) {
      res
        .status(400)
        .json({ error: "ValidationError", data: undefined, success: false });
    } else {
      res
        .status(500)
        .json({ error: "ServerError", data: undefined, success: false });
    }
  }
});

app.put("/users/edit/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await editUser(Number(userId), req.body);

    res.status(200).json({
      error: undefined,
      data: {
        id: result.id,
        email: result.email,
        username: result.username,
        firstName: result.firstName,
        lastName: result.lastName,
      },
      success: true,
    });
  } catch (e) {
    console.error(e);
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "2025") {
        res
          .status(404)
          .json({ error: "UserNotFound", data: undefined, success: false });
      } else if (
        e?.meta?.target instanceof Array &&
        e.meta?.target?.includes("email")
      ) {
        res.status(409).json({
          error: "EmailAlreadyInUse",
          data: undefined,
          success: false,
        });
      } else if (
        e?.meta?.target instanceof Array &&
        e.meta?.target?.includes("username")
      ) {
        res.status(409).json({
          error: "UsernameAlreadyTaken",
          data: undefined,
          success: false,
        });
      }
    } else if (e instanceof PrismaClientValidationError) {
      res
        .status(400)
        .json({ error: "ValidationError", data: undefined, success: false });
    } else {
      res
        .status(500)
        .json({ error: "ServerError", data: undefined, success: false });
    }
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
