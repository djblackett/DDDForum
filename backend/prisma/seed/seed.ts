/**
 * ! Executing this script will delete all data in your database and seed it with 10 member.
 * ! Make sure to adjust the script to your needs.
 * Use any TypeScript runner to run this script, for example: `npx tsx seed.ts`
 * Learn more about the Seed Client by following our guide: https://docs.snaplet.dev/seed/getting-started
 */
import { createSeedClient } from "@snaplet/seed";

const voteRandomizer = () => {
  const randomNum = Math.floor(Math.random() * 2);
  if (randomNum % 2 === 0) {
    return "Upvote";
  } else {
    return "Downvote";
  }
};

const main = async () => {
  const seed = await createSeedClient();

  // Truncate all tables in the database
  await seed.$resetDatabase();

  // Seed the database with 10 member
  await seed.member((x) => x(5));

  await seed.post(
    (x) =>
      x(10, {
        // Create 10 posts for each of those users
        comments: (x) => x({ min: 3, max: 7 }),
        votes: (x) =>
          x({ min: 1, max: 10 }, (ctx) => ({
            voteType: voteRandomizer(),
          })),
      }),
    { connect: true }
  );

  // Type completion not working? You might want to reload your TypeScript Server to pick up the changes

  console.log("Database seeded successfully!");

  process.exit();
};

main();
